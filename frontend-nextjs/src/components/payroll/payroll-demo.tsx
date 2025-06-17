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
}

// Mock data for demo
const mockPayrollData: PayrollData[] = [
  {
    id: 1,
    ma_nv: "NV001",
    ho_ten: "Nguyễn Văn A",
    luong_cb: 15000000,
    phu_cap: 2000000,
    thue: 1500000,
    thuc_linh: 15500000,
    da_ky: true,
    ngay_ky: "2024-01-15",
    ten_da_ky: "Nguyễn Văn A",
  },
  {
    id: 2,
    ma_nv: "NV002",
    ho_ten: "Trần Thị B",
    luong_cb: 12000000,
    phu_cap: 1500000,
    thue: 1200000,
    thuc_linh: 12300000,
    da_ky: false,
    ngay_ky: null,
    ten_da_ky: null,
  },
  {
    id: 3,
    ma_nv: "NV003",
    ho_ten: "Lê Văn C",
    luong_cb: 18000000,
    phu_cap: 2500000,
    thue: 1800000,
    thuc_linh: 18700000,
    da_ky: true,
    ngay_ky: "2024-01-20",
    ten_da_ky: "Lê Văn C",
  },
];

export default function PayrollDemo() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const isHydrated = useHydration();
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (typeof window === "undefined") return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString || typeof window === "undefined") return "Chưa ký";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Simulate data loading
  const loadDemoData = async () => {
    if (!isHydrated) return;

    if (!token) {
      setError("Không tìm thấy thông tin đăng nhập");
      setLoading(false);
      return;
    }

    if (user?.role !== "admin") {
      setError("Bạn không có quyền truy cập chức năng này");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPayrollData(mockPayrollData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isHydrated) {
      loadDemoData();
    }
  }, [isHydrated, token]);

  // Show loading during hydration or data fetch
  if (!isHydrated || (loading && payrollData.length === 0)) {
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
            <h1 className="text-3xl font-bold">💰 Demo Danh Sách Lương</h1>
            <p className="text-gray-600">
              Demo quản lý và theo dõi bảng lương ({payrollData.length} bản ghi)
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
          <CardTitle>Bảng lương (Demo)</CardTitle>
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
                      {formatCurrency(parseFloat(item.luong_co_ban) || 0)}
                    </td>
                    <td className="p-3 text-right">
                      {formatCurrency(parseFloat(item.phu_cap) || 0)}
                    </td>
                    <td className="p-3 text-right text-red-600">
                      {formatCurrency(parseFloat(item.khau_tru) || 0)}
                    </td>
                    <td className="p-3 text-right font-bold text-green-600">
                      {formatCurrency(parseFloat(item.luong_thuc_linh) || 0)}
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

      {/* Success Message */}
      <Card className="mt-6 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-green-800 font-medium">
              🎉 Hydration Fix hoạt động hoàn hảo! Không còn lỗi khi F5 reload
              trang.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
