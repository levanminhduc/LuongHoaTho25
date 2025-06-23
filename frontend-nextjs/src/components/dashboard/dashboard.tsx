"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RealtimeNotifications from "@/components/notifications/realtime-notifications";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function navigateToEmployees() {
    router.push("/employees");
  }

  function navigateToProfile() {
    router.push("/profile");
  }

  function navigateToImport() {
    router.push("/import");
  }

  function navigateToPayrollList() {
    router.push("/payroll");
  }

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hệ thống quản lý lương (Next.js)
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Xin chào, {user?.username} (
                {user?.role === "admin" ? "Quản trị viên" : "Nhân viên"})
              </span>
              <Button onClick={handleLogout} variant="destructive">
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Real-time Notifications for Admin */}
          {user?.role === "admin" && (
            <div className="mb-6">
              <RealtimeNotifications />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Admin Features */}
            {user?.role === "admin" && (
              <>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={navigateToEmployees}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">👥</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="text-sm font-medium text-gray-500 truncate">
                          Quản lý nhân viên
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          Thêm, sửa, xóa nhân viên
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow border-purple-200 bg-purple-50"
                  onClick={() => router.push("/employees-demo")}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">🧪</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="text-sm font-medium text-purple-600 truncate">
                          Demo Nhân viên (Hydration Fixed)
                        </div>
                        <div className="text-lg font-medium text-purple-900">
                          Test F5 reload không lỗi
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={navigateToPayrollList}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">💰</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="text-sm font-medium text-gray-500 truncate">
                          Quản lý lương
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          Xem danh sách lương
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow border-blue-200 bg-blue-50"
                  onClick={() => router.push("/payroll-demo")}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">🧪</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="text-sm font-medium text-blue-600 truncate">
                          Demo Lương (Hydration Fixed)
                        </div>
                        <div className="text-lg font-medium text-blue-900">
                          Test F5 reload không lỗi
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={navigateToImport}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">📊</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="text-sm font-medium text-gray-500 truncate">
                          Import Excel
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          Tải lên file lương
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Employee Features */}
            {user?.role === "employee" && (
              <>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={navigateToProfile}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">👤</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="text-sm font-medium text-gray-500 truncate">
                          Thông tin cá nhân
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          Xem và cập nhật thông tin
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/my-payroll")}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">💰</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="text-sm font-medium text-gray-500 truncate">
                          Lương của tôi
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          Xem chi tiết lương cá nhân
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Common Features */}
            <Card className="border-l-4 border-blue-500">
              <CardContent className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">⚡</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="text-sm font-medium text-gray-500 truncate">
                      Hệ thống mới
                    </div>
                    <div className="text-lg font-medium text-gray-900">
                      Next.js + NestJS Architecture
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Backend Status */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Backend Status
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Express.js (Cũ)
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      Port 4001
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">NestJS (Mới)</span>
                    <span className="text-sm font-medium text-blue-600">
                      Port 4002
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Frontend Status
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      React + Vite (Cũ)
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      Port 5173
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Next.js (Mới)</span>
                    <span className="text-sm font-medium text-blue-600">
                      Port 3000
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
