"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useHydration } from "@/hooks/use-hydration";

interface Employee {
  id: number;
  ma_nv: string;
  ho_ten: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  ma_nv: string;
  ho_ten: string;
  cccd: string;
}

// Mock data for demo
const mockEmployees: Employee[] = [
  {
    id: 1,
    ma_nv: "NV001",
    ho_ten: "Nguyễn Văn A",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: 2,
    ma_nv: "NV002", 
    ho_ten: "Trần Thị B",
    created_at: "2024-01-16T00:00:00Z",
    updated_at: "2024-01-16T00:00:00Z",
  },
  {
    id: 3,
    ma_nv: "NV003",
    ho_ten: "Lê Văn C", 
    created_at: "2024-01-17T00:00:00Z",
    updated_at: "2024-01-17T00:00:00Z",
  },
  {
    id: 4,
    ma_nv: "NV004",
    ho_ten: "Phạm Thị D",
    created_at: "2024-01-18T00:00:00Z", 
    updated_at: "2024-01-18T00:00:00Z",
  },
];

export default function EmployeeDemo() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const isHydrated = useHydration();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    ma_nv: "",
    ho_ten: "",
    cccd: "",
  });

  // Simulate data loading
  const loadDemoEmployees = async () => {
    if (!isHydrated) return;

    if (!token) {
      setError("Không tìm thấy thông tin đăng nhập");
      setLoading(false);
      return;
    }

    if (user?.role !== "admin") {
      setError("Bạn không có quyền truy cập chức năng này");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmployees(mockEmployees);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEmployee: Employee = {
        id: employees.length + 1,
        ma_nv: formData.ma_nv,
        ho_ten: formData.ho_ten,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setEmployees([...employees, newEmployee]);
      alert("Tạo nhân viên thành công (Demo)");
      setShowCreateModal(false);
      setFormData({ ma_nv: "", ho_ten: "", cccd: "" });
    } catch (error) {
      alert("Lỗi tạo nhân viên: " + error);
    }
  };

  const handleDelete = async (ma_nv: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmployees(employees.filter(emp => emp.ma_nv !== ma_nv));
      alert("Xóa nhân viên thành công (Demo)");
    } catch (error) {
      alert("Lỗi xóa nhân viên: " + error);
    }
  };

  useEffect(() => {
    if (isHydrated) {
      loadDemoEmployees();
    }
  }, [isHydrated, token]);

  // Show loading during hydration or data fetch
  if (!isHydrated || (loading && employees.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!isHydrated ? "Đang khởi tạo..." : "Đang tải dữ liệu..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={() => router.push("/dashboard")}>
            Quay lại Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              ← Quay lại
            </Button>
            <h1 className="text-3xl font-bold">👥 Demo Quản lý nhân viên</h1>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            Thêm nhân viên
          </Button>
        </div>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhân viên (Demo - {employees.length} người)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {employee.ho_ten.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{employee.ho_ten}</div>
                    <div className="text-sm text-gray-500">
                      Mã NV: {employee.ma_nv}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {typeof window !== "undefined" 
                      ? new Date(employee.created_at).toLocaleDateString("vi-VN")
                      : ""
                    }
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(employee.ma_nv)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}

            {employees.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500">Chưa có nhân viên nào</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      <Card className="mt-6 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-green-800 font-medium">
              🎉 Employee Hydration Fix hoạt động hoàn hảo! F5 reload không còn lỗi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Thêm nhân viên mới (Demo)</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mã nhân viên
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.ma_nv}
                    onChange={(e) =>
                      setFormData({ ...formData, ma_nv: e.target.value })
                    }
                    placeholder="VD: NV005"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Họ tên
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.ho_ten}
                    onChange={(e) =>
                      setFormData({ ...formData, ho_ten: e.target.value })
                    }
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CCCD</label>
                  <Input
                    type="text"
                    required
                    value={formData.cccd}
                    onChange={(e) =>
                      setFormData({ ...formData, cccd: e.target.value })
                    }
                    placeholder="Nhập số CCCD"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({ ma_nv: "", ho_ten: "", cccd: "" });
                    }}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">Tạo (Demo)</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
