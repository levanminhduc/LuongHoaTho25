import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User, Calendar, Clock } from 'lucide-react';
import employeeService from '@/services/employeeService';
import { Employee } from '@/types';
import { useAuthStore } from '@/store/authStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const EmployeeProfile: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  // Load employee profile
  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getMyProfile();
      setEmployee(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <User size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy thông tin
          </h3>
          <p className="text-gray-600">
            Không thể tải thông tin cá nhân của bạn
          </p>
          <button
            onClick={loadProfile}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
        <p className="text-gray-600">Xem thông tin cá nhân của bạn trong hệ thống</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header with avatar */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-3 mr-4">
              <User size={32} className="text-blue-600" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{employee.ho_ten}</h2>
              <p className="text-blue-100">Mã nhân viên: {employee.ma_nv}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Thông tin cơ bản
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <User size={16} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-medium text-gray-900">{employee.ho_ten}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">ID</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mã nhân viên</p>
                    <p className="font-medium text-gray-900">{employee.ma_nv}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">#</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID hệ thống</p>
                    <p className="font-medium text-gray-900">#{employee.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Thông tin hệ thống
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
                    <p className="font-medium text-gray-900">
                      {new Date(employee.created_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                    <p className="font-medium text-gray-900">
                      {new Date(employee.updated_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">R</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vai trò</p>
                    <p className="font-medium text-gray-900">
                      {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Thông tin được cập nhật tự động từ hệ thống
            </div>
            <button
              onClick={loadProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">i</span>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Thông tin đăng nhập
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Tên đăng nhập: <strong>{employee.ma_nv}</strong></p>
              <p>• Mật khẩu: Sử dụng số CCCD của bạn</p>
              <p>• Nếu quên mật khẩu, vui lòng liên hệ quản trị viên</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
