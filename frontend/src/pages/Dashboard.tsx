import React from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { User, FileSpreadsheet, Upload, CheckCircle } from "lucide-react";
import SignatureStats from "@/components/SignatureStats";

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chào mừng, {user?.fullName}!
            </h1>
            <p className="text-gray-600">
              {isAdmin ? "Quản trị viên hệ thống" : "Nhân viên"}
            </p>
          </div>
        </div>
      </div>

      {/* Signature Statistics for Admin */}
      {isAdmin && <SignatureStats className="mb-8" />}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAdmin ? (
          <>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Danh sách lương
                    </h3>
                    <p className="text-sm text-gray-600">
                      Xem và quản lý bảng lương
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Import Excel
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tải lên file bảng lương
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Trạng thái ký
                    </h3>
                    <p className="text-sm text-gray-600">
                      Theo dõi tình trạng ký nhận
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </>
        ) : (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bảng lương của tôi
                  </h3>
                  <p className="text-sm text-gray-600">
                    Xem thông tin lương cá nhân
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Hướng dẫn sử dụng
          </h3>
        </CardHeader>
        <CardBody>
          {isAdmin ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Import dữ liệu
                  </p>
                  <p className="text-sm text-gray-600">
                    Sử dụng chức năng "Import Excel" để tải lên file bảng lương
                    từ Excel
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Quản lý dữ liệu
                  </p>
                  <p className="text-sm text-gray-600">
                    Xem danh sách lương, tìm kiếm và theo dõi trạng thái ký nhận
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Xem bảng lương
                  </p>
                  <p className="text-sm text-gray-600">
                    Truy cập thông tin lương cá nhân của bạn
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Ký nhận lương
                  </p>
                  <p className="text-sm text-gray-600">
                    Xác nhận đã nhận lương bằng cách ký tên điện tử
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;
