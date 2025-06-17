import React, { useState } from "react";
import { Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Button from "@/components/ui/Button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar for all authenticated users */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile menu button */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center space-x-2"
            >
              <Menu className="h-4 w-4" />
              <span>Menu</span>
            </Button>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
