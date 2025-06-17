import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FileSpreadsheet, CheckCircle, XCircle, Edit3 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { payrollService } from "@/services/payrollService";
import { formatCurrency, formatDate } from "@/utils/format";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const PayrollDetail: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signName, setSignName] = useState(user?.fullName || "");

  const { data, isLoading, error } = useQuery({
    queryKey: ["payroll", user?.username],
    queryFn: () => payrollService.getPayrollByEmployeeId(user!.username),
    enabled: !!user?.username,
  });

  const signMutation = useMutation({
    mutationFn: (name: string) =>
      payrollService.signPayroll(user!.username, { ho_ten: name }),
    onSuccess: (data) => {
      toast.success(data.message);
      setIsSignModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["payroll", user?.username] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Ký tên thất bại";
      toast.error(message);
    },
  });

  const handleSign = () => {
    if (!signName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }
    signMutation.mutate(signName.trim());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <XCircle className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy thông tin lương
        </h3>
        <p className="text-gray-600">
          Thông tin lương của bạn chưa được cập nhật trong hệ thống.
        </p>
      </div>
    );
  }

  const payroll = data?.data;

  if (!payroll) {
    return (
      <div className="text-center py-12">
        <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có thông tin lương
        </h3>
        <p className="text-gray-600">
          Thông tin lương của bạn sẽ được cập nhật sớm.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bảng lương của tôi</h1>
        <p className="text-gray-600">Thông tin chi tiết về lương tháng</p>
      </div>

      {/* Payroll Card */}
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {payroll.ho_ten}
              </h3>
              <p className="text-sm text-gray-600">Mã NV: {payroll.ma_nv}</p>
            </div>
            <div className="text-right">
              {payroll.da_ky ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Đã ký nhận</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Chưa ký nhận</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-4">
            {/* Salary Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">
                  Lương cơ bản
                </div>
                <div className="text-xl font-bold text-blue-800">
                  {formatCurrency(payroll.luong_cb)}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">
                  Phụ cấp
                </div>
                <div className="text-xl font-bold text-green-800">
                  {formatCurrency(payroll.phu_cap)}
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Thuế</div>
                <div className="text-xl font-bold text-red-800">
                  {formatCurrency(payroll.thue)}
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">
                  Thực lĩnh
                </div>
                <div className="text-2xl font-bold text-purple-800">
                  {formatCurrency(payroll.thuc_linh)}
                </div>
              </div>
            </div>

            {/* Signature Status */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📝 Xác nhận nhận lương
              </h3>

              {payroll.da_ky && payroll.ngay_ky ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-green-800">
                        ✅ Đã ký nhận lương
                      </h4>
                      <p className="text-sm text-green-600">
                        Bạn đã xác nhận nhận lương thành công
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Người ký:
                        </span>
                        <p className="text-base font-semibold text-gray-900">
                          {payroll.ten_da_ky}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Thời gian ký:
                        </span>
                        <p className="text-base font-semibold text-gray-900">
                          {formatDate(payroll.ngay_ky)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Edit3 className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-yellow-800">
                        ⏳ Chưa ký nhận lương
                      </h4>
                      <p className="text-sm text-yellow-600">
                        Vui lòng ký xác nhận để hoàn tất việc nhận lương
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-blue-600">
                          ℹ️
                        </span>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p className="font-medium mb-1">
                          Lưu ý khi ký xác nhận:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Kiểm tra kỹ thông tin lương trước khi ký</li>
                          <li>Nhập chính xác họ tên của bạn</li>
                          <li>Sau khi ký sẽ không thể thay đổi</li>
                          <li>Thời gian ký sẽ được ghi lại tự động</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardBody>

        {!payroll.da_ky && (
          <CardFooter className="bg-gray-50">
            <div className="w-full space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Bạn đã kiểm tra và xác nhận thông tin lương chính xác?
                </p>
              </div>
              <Button
                onClick={() => setIsSignModalOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                size="lg"
              >
                <Edit3 className="h-5 w-5 mr-2" />
                ✍️ Ký xác nhận nhận lương
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Việc ký xác nhận sẽ được ghi lại và không thể thay đổi
              </p>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Sign Modal */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Edit3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      ✍️ Ký xác nhận nhận lương
                    </h3>
                    <p className="text-sm text-green-100">
                      Xác nhận bạn đã nhận lương tháng này
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                {/* Payroll Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    📋 Thông tin lương cần xác nhận:
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nhân viên:</span>
                      <span className="font-medium">
                        {payroll.ho_ten} ({payroll.ma_nv})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thực lĩnh:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(payroll.thuc_linh)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="mb-6">
                  <Input
                    label="Nhập họ tên để xác nhận"
                    value={signName}
                    onChange={(e) => setSignName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Vui lòng nhập chính xác họ tên như trong hồ sơ nhân sự
                  </p>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-2">
                    <div className="h-5 w-5 text-yellow-600 mt-0.5">⚠️</div>
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">
                        Lưu ý quan trọng:
                      </p>
                      <ul className="text-yellow-700 space-y-1">
                        <li>• Sau khi ký sẽ không thể thay đổi</li>
                        <li>• Thời gian ký sẽ được ghi lại tự động</li>
                        <li>• Chỉ ký khi đã kiểm tra kỹ thông tin</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                <Button
                  onClick={handleSign}
                  loading={signMutation.isPending}
                  disabled={signMutation.isPending || !signName.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  size="lg"
                >
                  {signMutation.isPending ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      ✍️ Xác nhận ký
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSignModalOpen(false);
                    setSignName("");
                  }}
                  disabled={signMutation.isPending}
                  className="border-gray-300"
                >
                  Hủy bỏ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollDetail;
