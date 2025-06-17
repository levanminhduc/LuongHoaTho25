"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useHydration } from "@/hooks/use-hydration";
import { useSSE } from "@/hooks/use-sse";
import RealtimeNotifications from "@/components/notifications/realtime-notifications";

interface PayrollData {
  id: number;
  ma_nv: string;
  ho_ten: string;
  luong_cb: string; // NestJS trả về string từ database
  phu_cap: string;
  thue: string;
  thuc_linh: string;
  da_ky: number; // NestJS trả về 0 hoặc 1
  ngay_ky: string | null;
  ten_da_ky: string | null;
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

export default function PayrollManagement() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const isHydrated = useHydration();
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // 📡 SSE Hook for real-time notifications and auto-refresh
  const { events, lastEvent, connected } = useSSE({
    autoConnect: true,
    eventTypes: ["payroll_signed", "test", "connection"],
  });

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

  // Fetch payroll data
  const fetchPayrollData = async (page = 1, keyword = "") => {
    // Wait for hydration before checking auth
    if (!isHydrated) {
      return;
    }

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
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        keyword: keyword,
      });

      const response = await fetch(
        `http://localhost:4002/api/payroll?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Không có quyền truy cập. Vui lòng đăng nhập lại.");
        } else if (response.status === 500) {
          throw new Error("Lỗi server. Vui lòng thử lại sau.");
        } else {
          throw new Error("Không thể tải danh sách lương");
        }
      }

      const result: PayrollListResponse = await response.json();
      setPayrollData(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isHydrated) {
      fetchPayrollData(currentPage, searchKeyword);
    }
  }, [currentPage, token, isHydrated]);

  // 📡 Auto-refresh when payroll_signed events are received
  useEffect(() => {
    if (!isHydrated || !lastEvent || lastEvent.type !== "payroll_signed")
      return;

    console.log(
      "📡 Payroll Management: Auto-refreshing data due to payroll_signed event:",
      lastEvent
    );

    // Refresh current page data
    fetchPayrollData(currentPage, searchKeyword);
  }, [lastEvent, isHydrated, currentPage, searchKeyword]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPayrollData(1, searchKeyword);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
            <h1 className="text-3xl font-bold">💰 Danh Sách Lương Nhân Viên</h1>
            <p className="text-gray-600">
              Quản lý và theo dõi bảng lương ({pagination.total} bản ghi)
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {user?.fullName} (
              {user?.role === "admin" ? "Quản trị viên" : "Nhân viên"})
            </span>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              ← Quay lại
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Notifications */}
      {user?.role === "admin" && (
        <div className="mb-6">
          <RealtimeNotifications />
        </div>
      )}

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm theo mã NV hoặc tên..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng lương</CardTitle>
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
                      {formatCurrency(parseFloat(item.luong_cb) || 0)}
                    </td>
                    <td className="p-3 text-right">
                      {formatCurrency(parseFloat(item.phu_cap) || 0)}
                    </td>
                    <td className="p-3 text-right text-red-600">
                      {formatCurrency(parseFloat(item.thue) || 0)}
                    </td>
                    <td className="p-3 text-right font-bold text-green-600">
                      {formatCurrency(parseFloat(item.thuc_linh) || 0)}
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

            {payrollData.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">Không có dữ liệu lương</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </Button>

              <div className="flex space-x-1">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
