import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

interface Employee {
  id: number;
  ma_nv: string;
  ho_ten: string;
  created_at: string;
  updated_at: string;
}

const SimpleEmployeeProfile: React.FC = () => {
  const { user, token } = useAuthStore();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  // Load employee profile
  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4001/api/employees/${user?.username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmployee(data.data);
      } else {
        alert('Lỗi tải thông tin cá nhân');
      }
    } catch (error) {
      alert('Lỗi kết nối: ' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const goBack = () => {
    window.location.href = '/simple-dashboard';
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
                Thông tin cá nhân
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Đang tải...</div>
            </div>
          ) : employee ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
                <div className="flex items-center">
                  <div className="bg-white rounded-full p-3 mr-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {employee.ho_ten.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{employee.ho_ten}</h2>
                    <p className="text-blue-100">Mã nhân viên: {employee.ma_nv}</p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="px-6 py-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.ho_ten}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Mã nhân viên</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.ma_nv}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID hệ thống</dt>
                    <dd className="mt-1 text-sm text-gray-900">#{employee.id}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
                    <dd className="mt-1 text-sm text-gray-900">Nhân viên</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ngày tạo tài khoản</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(employee.created_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Cập nhật lần cuối</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(employee.updated_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </dd>
                  </div>
                </dl>
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
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">Không tìm thấy thông tin cá nhân</div>
              <button
                onClick={loadProfile}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Login Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
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
                  <p>• Tên đăng nhập: <strong>{employee?.ma_nv}</strong></p>
                  <p>• Mật khẩu: Sử dụng số CCCD của bạn</p>
                  <p>• Nếu quên mật khẩu, vui lòng liên hệ quản trị viên</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEmployeeProfile;
