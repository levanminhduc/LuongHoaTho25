"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ImportExcel() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !token) {
      alert("Vui lòng chọn file và đăng nhập");
      return;
    }

    if (user?.role !== "admin") {
      alert("Bạn không có quyền sử dụng tính năng này");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await fetch("http://localhost:4002/api/import/salary", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          details: data.details || null,
        });
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById(
          "fileInput"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setResult({
          success: false,
          message: data.message || "Lỗi tải file",
          error: data.error || null,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Lỗi kết nối tới server",
        error: String(error),
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">📊 Import Excel</h1>
            <p className="text-gray-600">
              Tải lên file Excel chứa dữ liệu lương
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            ← Quay lại
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Tải lên file Excel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Chọn file Excel (.xlsx, .xls)
              </label>
              <input
                id="fileInput"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {file && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">File đã chọn:</span> {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  Kích thước: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? "Đang tải lên..." : "Tải lên"}
            </Button>

            {/* Result */}
            {result && (
              <div
                className={`p-4 rounded-md ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div
                  className={`font-medium ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {result.success ? "✅ Thành công" : "❌ Thất bại"}
                </div>
                <p
                  className={`text-sm mt-1 ${
                    result.success ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {result.message}
                </p>
                {result.details && (
                  <div className="mt-2 text-sm text-green-700">
                    <p>Chi tiết:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Số dòng đã xử lý: {result.details.processed}</li>
                      <li>Số dòng thành công: {result.details.success}</li>
                      <li>Số dòng lỗi: {result.details.errors}</li>
                    </ul>
                  </div>
                )}
                {result.error && (
                  <div className="mt-2 text-sm text-red-700">
                    <p>Lỗi: {result.error}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn sử dụng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Định dạng file Excel:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>File phải có đuôi .xlsx hoặc .xls</li>
                <li>Dữ liệu bắt đầu từ dòng 2 (dòng 1 là tiêu đề)</li>
                <li>Các cột bắt buộc theo thứ tự:</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <table className="text-xs w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-1">Cột</th>
                    <th className="text-left p-1">Tên trường</th>
                    <th className="text-left p-1">Kiểu dữ liệu</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr>
                    <td className="p-1">A</td>
                    <td className="p-1">Mã NV</td>
                    <td className="p-1">Text</td>
                  </tr>
                  <tr>
                    <td className="p-1">B</td>
                    <td className="p-1">Họ tên</td>
                    <td className="p-1">Text</td>
                  </tr>
                  <tr>
                    <td className="p-1">C</td>
                    <td className="p-1">Lương CB</td>
                    <td className="p-1">Number</td>
                  </tr>
                  <tr>
                    <td className="p-1">D</td>
                    <td className="p-1">Phụ cấp</td>
                    <td className="p-1">Number</td>
                  </tr>
                  <tr>
                    <td className="p-1">E</td>
                    <td className="p-1">Thuế</td>
                    <td className="p-1">Number</td>
                  </tr>
                  <tr>
                    <td className="p-1">F</td>
                    <td className="p-1">Thực lĩnh</td>
                    <td className="p-1">Number</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Lưu ý:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Nhân viên phải đã tồn tại trong hệ thống</li>
                <li>Số tiền phải là số dương</li>
                <li>Dữ liệu sẽ ghi đè lên thông tin lương hiện tại</li>
                <li>Hệ thống sẽ tự động tính toán thực lĩnh</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>Mẹo:</strong> Bạn có thể tải file mẫu từ danh sách
                lương hiện tại để có đúng định dạng.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
