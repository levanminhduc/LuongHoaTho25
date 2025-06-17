import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Đăng xuất thành công');
    } catch (error) {
      // Even if the API call fails, we should still logout locally
      logout();
      toast.success('Đăng xuất thành công');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                Hệ Thống Quản Lý Lương
              </h1>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span className="font-medium">{user?.fullName}</span>
              <span className="text-gray-500">
                ({user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'})
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
