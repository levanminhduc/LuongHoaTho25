"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";
import { useHydration } from "@/hooks/use-hydration";

// Mock data with proper values to test display
const mockPayrollData = [
  {
    id: 1,
    ma_nv: "admin",
    ho_ten: "Quản trị viên",
    luong_co_ban: "20000000.00",
    phu_cap: "5000000.00",
    khau_tru: "2500000.00",
    luong_thuc_linh: "22500000.00",
    da_ky: 1,
    ngay_ky: "2025-06-16T13:19:09.000Z",
    ten_da_ky: "Quản trị viên",
    created_at: "2025-06-16T13:19:09.000Z"
  },
  {
    id: 2,
    ma_nv: "NV001",
    ho_ten: "Nguyễn Văn An",
    luong_co_ban: "15000000.00",
    phu_cap: "3000000.00",
    khau_tru: "1800000.00",
    luong_thuc_linh: "16200000.00",
    da_ky: 0,
    ngay_ky: null,
    ten_da_ky: null,
    created_at: "2025-06-16T13:19:09.000Z"
  },
  {
    id: 3,
    ma_nv: "NV002",
    ho_ten: "Trần Thị Bình",
    luong_co_ban: "12000000.00",
    phu_cap: "2500000.00",
    khau_tru: "1450000.00",
    luong_thuc_linh: "13050000.00",
    da_ky: 1,
    ngay_ky: "2025-06-15T10:30:00.000Z",
    ten_da_ky: "Trần Thị Bình",
    created_at: "2025-06-16T13:19:09.000Z"
  },
  {
    id: 4,
    ma_nv: "NV003",
    ho_ten: "Lê Văn Cường",
    luong_co_ban: "18000000.00",
    phu_cap: "3500000.00",
    khau_tru: "2150000.00",
    luong_thuc_linh: "19350000.00",
    da_ky: 1,
    ngay_ky: "2025-06-14T14:45:00.000Z",
    ten_da_ky: "Lê Văn Cường",
    created_at: "2025-06-16T13:19:09.000Z"
  }
];

export default function PayrollDemoFixed() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const isHydrated = useHydration();
  const [payrollData, setPayrollData] = useState(mockPayrollData);
  const [loading, setLoading] = useState(false);

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (typeof window === "undefined") return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numAmount || 0);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString || typeof window === "undefined") return "Chưa ký";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  useEffect(() => {
    if (isHydrated && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">💰 Demo Bảng Lương (Fixed)</h1>
            <p className="text-gray-600">
              Demo với dữ liệu mock để test hiển thị ({payrollData.length} bản ghi)
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {user?.fullName || user?.username} (
              {user?.role === "admin" ? "Quản trị viên" : "Nhân viên"})
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
          <CardTitle>Bảng lương (Demo Fixed)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Mã NV</th>
                  <th className="text-left p-3">Họ tên</th>
                  <th className="text-right p-3">Lương CB</th>
                  <th className="text-right p-3">Phụ cấp</th>
                  <th className="text-right p-3">Thuế</th>
                  <th className="text-right p-3">Thực lĩnh</th>
                  <th className="text-center p-3">Trạng thái</th>
                  <th className="text-center p-3">Ngày ký</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm">{item.ma_nv}</td>
                    <td className="p-3 font-medium">{item.ho_ten}</td>
                    <td className="p-3 text-right">
                      {formatCurrency(item.luong_co_ban)}
                    </td>
                    <td className="p-3 text-right">
                      {formatCurrency(item.phu_cap)}
                    </td>
                    <td className="p-3 text-right text-red-600">
                      {formatCurrency(item.khau_tru)}
                    </td>
                    <td className="p-3 text-right font-bold text-green-600">
                      {formatCurrency(item.luong_thuc_linh)}
                    </td>
                    <td className="p-3 text-center">
                      {item.da_ky === 1 || (item.ngay_ky && item.ten_da_ky) ? (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tóm tắt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{payrollData.length}</div>
              <div className="text-sm text-gray-600">Tổng nhân viên</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {payrollData.filter(item => item.da_ky === 1).length}
              </div>
              <div className="text-sm text-gray-600">Đã ký</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {payrollData.filter(item => item.da_ky === 0).length}
              </div>
              <div className="text-sm text-gray-600">Chưa ký</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(
                  payrollData.reduce((sum, item) => sum + parseFloat(item.luong_thuc_linh), 0)
                )}
              </div>
              <div className="text-sm text-gray-600">Tổng thực lĩnh</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
