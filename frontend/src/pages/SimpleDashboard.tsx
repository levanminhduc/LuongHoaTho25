import React from "react";
import { useAuthStore } from "@/store/authStore";

const SimpleDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/simple-login";
  };

  const navigateToEmployees = () => {
    window.location.href = "/employees";
  };

  const navigateToProfile = () => {
    window.location.href = "/profile";
  };

  const navigateToImport = () => {
    window.location.href = "/import";
  };

  const navigateToMyPayroll = () => {
    window.location.href = "/simple-payroll";
  };

  const navigateToSSETest = () => {
    window.location.href = "/sse-test";
  };

  const navigateToBasicPayroll = () => {
    window.location.href = "/simple-payroll-list-basic";
  };

  const navigateToPayrollList = () => {
    window.location.href = "/simple-payroll-list";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hệ thống quản lý lương
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Xin chào, {user?.fullName} (
                {user?.role === "admin" ? "Quản trị viên" : "Nhân viên"})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Admin Features */}
            {user?.role === "admin" && (
              <>
                <div
                  onClick={navigateToEmployees}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">👥</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Quản lý nhân viên
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Thêm, sửa, xóa nhân viên
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={navigateToPayrollList}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">💰</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Quản lý lương
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Xem danh sách lương (Real-time SSE)
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={navigateToImport}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">📊</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Import Excel
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Tải lên file lương
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Cards for Admin */}
                <div
                  onClick={navigateToSSETest}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow border-l-4 border-yellow-500"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">🧪</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Test SSE
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Test Real-time Events
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={navigateToBasicPayroll}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow border-l-4 border-gray-500"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">📋</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Lương Basic
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Không có SSE (Backup)
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Employee Features */}
            {user?.role === "employee" && (
              <>
                <div
                  onClick={navigateToProfile}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">👤</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Thông tin cá nhân
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Xem profile của tôi
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={navigateToMyPayroll}
                  className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">💰</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Lương của tôi
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Xem & ký xác nhận lương
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Hướng dẫn sử dụng
              </h3>
              {user?.role === "admin" ? (
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    • <strong>Quản lý nhân viên:</strong> Thêm, sửa, xóa thông
                    tin nhân viên
                  </p>
                  <p>
                    • <strong>Quản lý lương:</strong> Xem danh sách lương của
                    tất cả nhân viên
                  </p>
                  <p>
                    • <strong>Import Excel:</strong> Tải lên file Excel chứa dữ
                    liệu lương
                  </p>
                </div>
              ) : (
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    • <strong>Thông tin cá nhân:</strong> Xem thông tin profile
                    của bạn
                  </p>
                  <p>
                    • <strong>Lương của tôi:</strong> Xem thông tin lương cá
                    nhân
                  </p>
                  <p>
                    • <strong>Đăng nhập:</strong> Sử dụng mã nhân viên và số
                    CCCD
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
