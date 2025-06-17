import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { User, Lock, UserCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { LoginRequest } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

const Login: React.FC = () => {
  const { isAuthenticated, login } = useAuthStore();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
    role: 'employee',
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success(data.message);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    loginMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Đăng nhập hệ thống
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hệ thống quản lý và tra cứu lương
          </p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">
              Thông tin đăng nhập
            </h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="employee">Nhân viên</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              {/* Username */}
              <Input
                label={formData.role === 'admin' ? 'Tên đăng nhập' : 'Mã nhân viên'}
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={formData.role === 'admin' ? 'Nhập tên đăng nhập' : 'Nhập mã nhân viên'}
                required
              />

              {/* Password */}
              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                loading={loginMutation.isPending}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Thông tin demo:
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Nhân viên:</strong> Sử dụng mã nhân viên có trong hệ thống</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;
