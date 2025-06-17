import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Calendar, User, Clock, Download } from 'lucide-react';
import { payrollService } from '@/services/payrollService';
import { formatDate, formatCurrency, debounce } from '@/utils/format';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface SignatureHistoryProps {
  className?: string;
}

const SignatureHistory: React.FC<SignatureHistoryProps> = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ['signature-history', currentPage, searchTerm],
    queryFn: () => payrollService.getAllPayrolls({ 
      page: currentPage, 
      limit, 
      keyword: searchTerm 
    }),
  });

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export signature history');
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardBody className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardBody className="text-center py-12">
          <p className="text-red-500">Không thể tải lịch sử ký</p>
        </CardBody>
      </Card>
    );
  }

  const signedPayrolls = data?.data.filter(p => p.da_ky && p.ngay_ky) || [];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📋 Lịch sử ký nhận lương
            </h3>
            <p className="text-sm text-gray-600">
              Danh sách nhân viên đã ký nhận lương
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Xuất Excel</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-0">
        {signedPayrolls.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có nhân viên nào ký nhận lương'}
            </p>
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
                    Thực lĩnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian ký
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {signedPayrolls.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payroll.ho_ten}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payroll.ma_nv}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payroll.thuc_linh)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payroll.ten_da_ky}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div className="text-sm text-gray-900">
                          {formatDate(payroll.ngay_ky!)}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination && data.pagination.totalPages > 1 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, data.pagination.total)} 
              trong tổng số {data.pagination.total} bản ghi
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!data.pagination.hasPrev}
              >
                Trước
              </Button>
              <span className="text-sm text-gray-700">
                Trang {currentPage} / {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!data.pagination.hasNext}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default SignatureHistory;
