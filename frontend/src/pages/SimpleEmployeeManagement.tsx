import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

interface Employee {
  id: number;
  ma_nv: string;
  ho_ten: string;
  created_at: string;
  updated_at: string;
}

const SimpleEmployeeManagement: React.FC = () => {
  const { user, token } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    ma_nv: '',
    ho_ten: '',
    cccd: ''
  });

  // Load employees
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4001/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data.data);
      } else {
        alert('Lỗi tải danh sách nhân viên');
      }
    } catch (error) {
      alert('Lỗi kết nối: ' + error);
    } finally {
      setLoading(false);
    }
  };

  // Create employee
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4001/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Tạo nhân viên thành công');
        setShowCreateModal(false);
        setFormData({ ma_nv: '', ho_ten: '', cccd: '' });
        loadEmployees();
      } else {
        const data = await response.json();
        alert('Lỗi tạo nhân viên: ' + data.message);
      }
    } catch (error) {
      alert('Lỗi kết nối: ' + error);
    }
  };

  // Delete employee
  const handleDelete = async (ma_nv: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;

    try {
      const response = await fetch(`http://localhost:4001/api/employees/${ma_nv}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Xóa nhân viên thành công');
        loadEmployees();
      } else {
        const data = await response.json();
        alert('Lỗi xóa nhân viên: ' + data.message);
      }
    } catch (error) {
      alert('Lỗi kết nối: ' + error);
    }
  };

  useEffect(() => {
    loadEmployees();
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
                Quản lý nhân viên
              </h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Thêm nhân viên
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Đang tải...</div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <li key={employee.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {employee.ho_ten.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.ho_ten}
                          </div>
                          <div className="text-sm text-gray-500">
                            Mã NV: {employee.ma_nv}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {new Date(employee.created_at).toLocaleDateString('vi-VN')}
                        </span>
                        <button
                          onClick={() => handleDelete(employee.ma_nv)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              {employees.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500">Chưa có nhân viên nào</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm nhân viên mới</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã nhân viên</label>
                  <input
                    type="text"
                    required
                    value={formData.ma_nv}
                    onChange={(e) => setFormData({ ...formData, ma_nv: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="VD: NV011"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                  <input
                    type="text"
                    required
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CCCD</label>
                  <input
                    type="text"
                    required
                    value={formData.cccd}
                    onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập số CCCD"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({ ma_nv: '', ho_ten: '', cccd: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Tạo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleEmployeeManagement;
