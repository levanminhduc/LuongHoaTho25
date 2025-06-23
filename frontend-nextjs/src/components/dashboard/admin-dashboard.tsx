"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import RealtimeNotifications from "@/components/notifications/realtime-notifications";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">🏢 Dashboard Quản trị</h1>
        <p className="text-gray-600">Quản lý hệ thống lương và nhân viên</p>
      </div>

      {/* Real-time Notifications */}
      <RealtimeNotifications className="col-span-full lg:col-span-2" />

      {/* Admin Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Employee Management */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/employees")}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>👥</span>
              <span>Quản lý nhân viên</span>
            </CardTitle>
            <CardDescription>
              Thêm, sửa, xóa thông tin nhân viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Xem danh sách nhân viên</Button>
          </CardContent>
        </Card>

        {/* Payroll Management */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/payroll")}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>💰</span>
              <span>Quản lý lương</span>
            </CardTitle>
            <CardDescription>
              Xem và quản lý bảng lương nhân viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Xem bảng lương</Button>
          </CardContent>
        </Card>

        {/* Import Excel */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/import")}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📂</span>
              <span>Import Excel</span>
            </CardTitle>
            <CardDescription>
              Import dữ liệu lương từ file Excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Import dữ liệu</Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">👥 Tổng nhân viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">--</div>
            <p className="text-sm text-gray-600">Đang tải...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">💰 Bảng lương tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">--</div>
            <p className="text-sm text-gray-600">Đang tải...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">✅ Đã ký xác nhận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">--</div>
            <p className="text-sm text-gray-600">Đang tải...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
