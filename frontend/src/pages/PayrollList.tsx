import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, FileSpreadsheet, CheckCircle, XCircle } from "lucide-react";
import { payrollService } from "@/services/payrollService";
import { formatCurrency, formatDate, debounce } from "@/utils/format";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const PayrollList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const limit = 10;

  // Debounce search keyword
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedKeyword(value);
        setPage(1); // Reset to first page when searching
      }, 300),
    []
  );

  React.useEffect(() => {
    debouncedSearch(keyword);
  }, [keyword, debouncedSearch]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["payrolls", page, limit, debouncedKeyword],
    queryFn: () =>
      payrollService.getAllPayrolls({
        page,
        limit,
        keyword: debouncedKeyword,
      }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <XCircle className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Lỗi tải dữ liệu
        </h3>
        <p className="text-gray-600">
          Không thể tải danh sách bảng lương. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Danh sách bảng lương
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi bảng lương nhân viên
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {data?.pagination.total || 0} bản ghi
          </span>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardBody>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo mã nhân viên hoặc họ tên..."
                value={keyword}
                onChange={handleSearch}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Bảng lương nhân viên
          </h3>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lương CB
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phụ cấp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thuế
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thực lĩnh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái ký
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.data.map((payroll) => (
                    <tr key={payroll.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payroll.ho_ten}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payroll.ma_nv}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(payroll.luong_cb)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(payroll.phu_cap)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(payroll.thue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payroll.thuc_linh)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payroll.da_ky ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-800 font-semibold">
                                ✅ Đã ký
                              </span>
                            </div>
                            {payroll.ngay_ky && (
                              <div className="text-xs text-gray-500">
                                {formatDate(payroll.ngay_ky)}
                              </div>
                            )}
                            {payroll.ten_da_ky && (
                              <div className="text-xs text-gray-600">
                                Người ký: {payroll.ten_da_ky}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-yellow-700 font-medium">
                              ⏳ Chưa ký</span>
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {data?.data.length === 0 && (
                <div className="text-center py-12">
                  <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không có dữ liệu
                  </h3>
                  <p className="text-gray-600">
                    {keyword
                      ? "Không tìm thấy kết quả phù hợp"
                      : "Chưa có bảng lương nào"}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {(page - 1) * limit + 1} đến{" "}
            {Math.min(page * limit, data.pagination.total)}
            trong tổng số {data.pagination.total} bản ghi
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={!data.pagination.hasPrev}
            >
              Trước
            </Button>
            <span className="text-sm text-gray-700">
              Trang {page} / {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={!data.pagination.hasNext}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollList;
