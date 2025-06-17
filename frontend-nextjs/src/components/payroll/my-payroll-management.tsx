"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useHydration } from "@/hooks/use-hydration";

interface PayrollData {
  id: number;
  ma_nv: string;
  ho_ten: string;
  luong_cb: number;
  phu_cap: number;
  thue: number;
  thuc_linh: number;
  da_ky: boolean;
  ngay_ky: string | null;
  ten_da_ky: string | null;
  created_at: string;
  updated_at: string;
}

interface PayrollListResponse {
  data: PayrollData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function MyPayrollManagement() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const isHydrated = useHydration();
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa ký";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Fetch my payroll data
  const fetchMyPayrollData = async () => {
    // Wait for hydration before checking auth
    if (!isHydrated) {
      return;
    }

    if (!token || !user?.username) {
      setError("Không tìm thấy thông tin đăng nhập");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(
        "💰 Fetching payroll for employee:",
        user.username,
        "role:",
        user.role
      );

      // Use specific endpoint for employee payroll
      const response = await fetch(
        `http://localhost:4002/api/payroll/${user.username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📡 Payroll response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Payroll data received:", result);
        // Backend returns single employee payroll data as array
        const payrollArray = Array.isArray(result.data)
          ? result.data
          : [result.data].filter(Boolean);
        setPayrollData(payrollArray);
      } else {
        const errorData = await response.json();
        console.error("❌ Payroll fetch error:", errorData);
        setError(errorData.message || "Không thể tải danh sách lương");
      }
    } catch (err: any) {
      console.error("❌ Payroll fetch exception:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isHydrated) {
      fetchMyPayrollData();
    }
  }, [token, isHydrated]);

  // Sign payroll
  const handleSignPayroll = async (payrollItem: PayrollData) => {
    if (!confirm("Bạn có chắc chắn muốn ký xác nhận bảng lương này?")) return;

    try {
      console.log(
        "✍️ Signing payroll for:",
        payrollItem.ma_nv,
        "name:",
        payrollItem.ho_ten
      );

      const response = await fetch(
        `http://localhost:4002/api/payroll/${payrollItem.ma_nv}/sign`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ho_ten: payrollItem.ho_ten,
          }),
        }
      );

      console.log("📡 Sign response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Sign successful:", result);
        alert("Ký xác nhận bảng lương thành công");
        fetchMyPayrollData();
      } else {
        const errorData = await response.json();
        console.error("❌ Sign error:", errorData);
        alert("Lỗi ký bảng lương: " + (errorData.message || "Không xác định"));
      }
    } catch (error) {
      console.error("❌ Sign exception:", error);
      alert("Lỗi kết nối: " + error);
    }
  };

  // Show loading during hydration or data fetch
  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!isHydrated ? "Đang khởi tạo..." : "Đang tải dữ liệu..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={() => router.push("/dashboard")}>
            Quay lại Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">💰 Lương của tôi</h1>
            <p className="text-gray-600">
              Xem chi tiết bảng lương cá nhân ({payrollData.length} bản ghi)
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {user?.fullName || user?.username}
            </span>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              ← Quay lại
            </Button>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử lương</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Tháng</th>
                  <th className="text-right p-3">Lương CB</th>
                  <th className="text-right p-3">Phụ cấp</th>
                  <th className="text-right p-3">Thuế</th>
                  <th className="text-right p-3">Thực lĩnh</th>
                  <th className="text-center p-3">Trạng thái</th>
                  <th className="text-center p-3">Ngày ký</th>
                  <th className="text-center p-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {new Date(item.created_at).toLocaleDateString("vi-VN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3 text-right">
                      {formatCurrency(item.luong_cb)}
                    </td>
                    <td className="p-3 text-right">
                      {formatCurrency(item.phu_cap)}
                    </td>
                    <td className="p-3 text-right text-red-600">
                      {formatCurrency(item.thue)}
                    </td>
                    <td className="p-3 text-right font-bold text-green-600">
                      {formatCurrency(item.thuc_linh)}
                    </td>
                    <td className="p-3 text-center">
                      {item.da_ky ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Đã ký
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⏳ Chưa ký
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center text-sm text-gray-600">
                      {formatDate(item.ngay_ky)}
                    </td>
                    <td className="p-3 text-center">
                      {!item.da_ky && (
                        <Button
                          size="sm"
                          onClick={() => handleSignPayroll(item)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Ký xác nhận
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {payrollData.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">Chưa có dữ liệu lương</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tổng quan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">
                Tổng số kỳ lương
              </div>
              <div className="text-2xl font-bold text-blue-800">
                {payrollData.length}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">
                Đã ký xác nhận
              </div>
              <div className="text-2xl font-bold text-green-800">
                {payrollData.filter((item) => item.da_ky).length}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Chưa ký</div>
              <div className="text-2xl font-bold text-yellow-800">
                {payrollData.filter((item) => !item.da_ky).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
