import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

interface PayrollData {
  id: number;
  ma_nv: string;
  ho_ten: string;
  luong_cb: number;
  phu_cap: number;
  thue: number;
  thuc_linh: number;
  da_ky: boolean;
  ngay_ky: string | null;
  ten_da_ky: string | null;
}

const SimplePayrollDetail: React.FC = () => {
  const { user, token } = useAuthStore();
  const [payrollData, setPayrollData] = useState<PayrollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signName, setSignName] = useState(user?.fullName || "");
  const [signing, setSigning] = useState(false);

  // Fetch payroll data
  useEffect(() => {
    const fetchPayrollData = async () => {
      if (!user?.username || !token) {
        setError("Không tìm thấy thông tin đăng nhập");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:4001/api/payroll/${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể tải thông tin lương");
        }

        const result = await response.json();
        setPayrollData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [user?.username, token]);

  // Handle sign payroll
  const handleSign = async () => {
    if (!signName.trim()) {
      alert("Vui lòng nhập họ tên");
      return;
    }

    if (!user?.username || !token) {
      alert("Không tìm thấy thông tin đăng nhập");
      return;
    }

    setSigning(true);
    try {
      const response = await fetch(
        `http://localhost:4001/api/payroll/${user.username}/sign`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ho_ten: signName.trim() }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ký tên thất bại");
      }

      const result = await response.json();
      alert("✅ " + result.message);
      
      // Refresh data
      setPayrollData(prev => prev ? {
        ...prev,
        da_ky: true,
        ngay_ky: new Date().toISOString(),
        ten_da_ky: signName.trim()
      } : null);
      
      setIsSignModalOpen(false);
    } catch (err: any) {
      alert("❌ " + err.message);
    } finally {
      setSigning(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa ký";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">❌ {error}</p>
          <button
            onClick={() => window.location.href = "/simple-dashboard"}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!payrollData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Không tìm thấy thông tin lương</p>
          <button
            onClick={() => window.location.href = "/simple-dashboard"}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                💰 Thông Tin Lương Của Tôi
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.fullName} ({user?.role === "admin" ? "Quản trị viên" : "Nhân viên"})
              </span>
              <button
                onClick={() => window.location.href = "/simple-dashboard"}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Payroll Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {payrollData.ho_ten}
                  </h3>
                  <p className="text-sm text-gray-600">Mã NV: {payrollData.ma_nv}</p>
                </div>
                <div className="text-right">
                  {payrollData.da_ky ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <span className="text-2xl">✅</span>
                      <span className="text-sm font-medium">Đã ký nhận</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-600">
                      <span className="text-2xl">❌</span>
                      <span className="text-sm font-medium">Chưa ký nhận</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Salary Details */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Lương cơ bản</div>
                  <div className="text-xl font-bold text-blue-800">
                    {formatCurrency(payrollData.luong_cb)}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Phụ cấp</div>
                  <div className="text-xl font-bold text-green-800">
                    {formatCurrency(payrollData.phu_cap)}
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 font-medium">Thuế</div>
                  <div className="text-xl font-bold text-red-800">
                    {formatCurrency(payrollData.thue)}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Thực lĩnh</div>
                  <div className="text-2xl font-bold text-purple-800">
                    {formatCurrency(payrollData.thuc_linh)}
                  </div>
                </div>
              </div>

              {/* Signature Status */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📝 Xác nhận nhận lương
                </h3>
                
                {payrollData.da_ky ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="text-green-800 font-medium">
                          Đã ký xác nhận nhận lương
                        </p>
                        <p className="text-green-600 text-sm">
                          Người ký: <strong>{payrollData.ten_da_ky}</strong>
                        </p>
                        <p className="text-green-600 text-sm">
                          Thời gian: {formatDate(payrollData.ngay_ky)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <p className="text-yellow-800 font-medium">
                          Chưa ký xác nhận nhận lương
                        </p>
                        <p className="text-yellow-600 text-sm">
                          Vui lòng ký xác nhận sau khi kiểm tra thông tin lương
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setIsSignModalOpen(true)}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      ✍️ Ký xác nhận nhận lương
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Modal */}
      {isSignModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                Ký xác nhận nhận lương
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Thông tin lương cần xác nhận:</strong>
                </p>
                <p className="text-sm">
                  Nhân viên: <strong>{payrollData.ho_ten} ({payrollData.ma_nv})</strong>
                </p>
                <p className="text-sm">
                  Thực lĩnh: <strong className="text-green-600">{formatCurrency(payrollData.thuc_linh)}</strong>
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập họ tên để xác nhận:
                </label>
                <input
                  type="text"
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Vui lòng nhập chính xác họ tên như trong hồ sơ nhân sự
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSign}
                  disabled={signing || !signName.trim()}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {signing ? "Đang xử lý..." : "✍️ Xác nhận ký"}
                </button>
                <button
                  onClick={() => {
                    setIsSignModalOpen(false);
                    setSignName(user?.fullName || "");
                  }}
                  disabled={signing}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplePayrollDetail;
