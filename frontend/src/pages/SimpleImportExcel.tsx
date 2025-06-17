import React, { useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";

interface ImportResult {
  totalRows: number;
  processedRows: number;
  insertedRows: number;
  errors: string[];
}

const SimpleImportExcel: React.FC = () => {
  const { token } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Chỉ chấp nhận file Excel (.xls, .xlsx)");
        return;
      }

      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File không được vượt quá 10MB");
        return;
      }

      setFile(selectedFile);
      setError("");
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Vui lòng chọn file Excel");
      return;
    }

    if (!token) {
      setError("Không có token xác thực. Vui lòng đăng nhập lại.");
      return;
    }

    setUploading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("🔑 Token:", token ? "Có token" : "Không có token");
      console.log("📁 File:", file.name);

      const API_BASE_URL = "http://localhost:4001/api";
      const response = await fetch(`${API_BASE_URL}/import/excel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("📡 Response status:", response.status);

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(data.message || "Lỗi upload file");
        if (data.errors && data.errors.length > 0) {
          setError(data.message + "\n" + data.errors.join("\n"));
        }
      }
    } catch (error) {
      setError("Lỗi kết nối server: " + error);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const API_BASE_URL = "http://localhost:4001/api";
      const response = await fetch(`${API_BASE_URL}/import/template`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mau_import_luong.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Lỗi tải file mẫu");
      }
    } catch (error) {
      setError("Lỗi kết nối: " + error);
    }
  };

  const goBack = () => {
    window.location.href = "/simple-dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Quay lại
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Import dữ liệu lương từ Excel
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">i</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  Hướng dẫn import dữ liệu
                </h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>
                    1. Tải file mẫu Excel bằng cách click nút "Tải file mẫu" bên
                    dưới
                  </p>
                  <p>2. Điền dữ liệu lương vào file mẫu theo đúng format:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      <strong>ma_nv:</strong> Mã nhân viên (bắt buộc, phải tồn
                      tại trong hệ thống)
                    </li>
                    <li>
                      <strong>ho_ten:</strong> Họ tên nhân viên (bắt buộc)
                    </li>
                    <li>
                      <strong>luong_cb:</strong> Lương cơ bản (số)
                    </li>
                    <li>
                      <strong>phu_cap:</strong> Phụ cấp (số)
                    </li>
                    <li>
                      <strong>thue:</strong> Thuế (số)
                    </li>
                    <li>
                      <strong>thuc_linh:</strong> Thực lĩnh (tự động tính nếu để
                      trống)
                    </li>
                  </ul>
                  <p>3. Lưu file và upload lên hệ thống</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Template */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Bước 1: Tải file mẫu
            </h3>
            <button
              onClick={downloadTemplate}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <span>📥</span>
              <span>Tải file mẫu Excel</span>
            </button>
          </div>

          {/* Upload File */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Bước 2: Upload file dữ liệu
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn file Excel
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {file && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>File đã chọn:</strong> {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Kích thước: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`px-6 py-3 rounded-lg font-medium ${
                  !file || uploading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {uploading ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang upload...</span>
                  </span>
                ) : (
                  "Upload và Import"
                )}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-500 text-xl">❌</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Có lỗi xảy ra
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <pre className="whitespace-pre-wrap">{error}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-500 text-xl">✅</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800 mb-2">
                    Import thành công!
                  </h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>
                      📊 Tổng số dòng trong file:{" "}
                      <strong>{result.totalRows}</strong>
                    </p>
                    <p>
                      ✅ Số dòng xử lý thành công:{" "}
                      <strong>{result.processedRows}</strong>
                    </p>
                    <p>
                      💾 Số bản ghi đã lưu:{" "}
                      <strong>{result.insertedRows}</strong>
                    </p>

                    {result.errors && result.errors.length > 0 && (
                      <div className="mt-4">
                        <p className="font-medium text-red-700">
                          Một số lỗi nhỏ:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {result.errors.map((err, index) => (
                            <li key={index} className="text-red-600 text-xs">
                              {err}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleImportExcel;
