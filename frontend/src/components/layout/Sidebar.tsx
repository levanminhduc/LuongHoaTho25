import React from "react";
import { NavLink } from "react-router-dom";
import { FileSpreadsheet, Upload, Home, Users, User } from "lucide-react";
import { cn } from "@/utils/format";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      {
        name: "Trang chủ",
        href: "/dashboard",
        icon: Home,
      },
    ];

    if (user?.role === "admin") {
      return [
        ...commonItems,
        {
          name: "Quản lý nhân viên",
          href: "/employees",
          icon: Users,
        },
        {
          name: "Danh sách lương",
          href: "/payroll",
          icon: FileSpreadsheet,
        },
        {
          name: "Import Excel",
          href: "/import",
          icon: Upload,
        },
      ];
    } else if (user?.role === "employee") {
      return [
        ...commonItems,
        {
          name: "Thông tin cá nhân",
          href: "/profile",
          icon: User,
        },
        {
          name: "Lương của tôi",
          href: "/my-payroll",
          icon: FileSpreadsheet,
        },
      ];
    }

    return commonItems;
  };

  const navigation = getNavigationItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Đóng menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary-100 text-primary-700 border-r-2 border-primary-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
                onClick={() => {
                  // Close mobile menu when clicking a link
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
