import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { payrollService } from '@/services/payrollService';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface SignatureStatsProps {
  className?: string;
}

const SignatureStats: React.FC<SignatureStatsProps> = ({ className = '' }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['payroll-stats'],
    queryFn: () => payrollService.getAllPayrolls({ limit: 1000 }), // Get all records for stats
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardBody className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </CardBody>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className={className}>
        <CardBody className="text-center py-8">
          <p className="text-gray-500">Không thể tải thống kê</p>
        </CardBody>
      </Card>
    );
  }

  const totalEmployees = data.data.length;
  const signedEmployees = data.data.filter(p => p.da_ky).length;
  const unsignedEmployees = totalEmployees - signedEmployees;
  const signedPercentage = totalEmployees > 0 ? Math.round((signedEmployees / totalEmployees) * 100) : 0;

  const stats = [
    {
      title: 'Tổng nhân viên',
      value: totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Đã ký nhận',
      value: signedEmployees,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Chưa ký',
      value: unsignedEmployees,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Tỷ lệ hoàn thành',
      value: `${signedPercentage}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">
          📊 Thống kê ký nhận lương
        </h3>
        <p className="text-sm text-gray-600">
          Tình hình ký nhận lương của nhân viên
        </p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-lg p-4 border border-opacity-20`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`h-12 w-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Tiến độ ký nhận
            </span>
            <span className="text-sm text-gray-500">
              {signedEmployees}/{totalEmployees}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${signedPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {signedPercentage === 100 
              ? '🎉 Tất cả nhân viên đã ký nhận lương!'
              : `Còn ${unsignedEmployees} nhân viên chưa ký nhận`
            }
          </p>
        </div>

        {/* Recent Signatures */}
        {data.data.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              📝 Ký nhận gần đây
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {data.data
                .filter(p => p.da_ky && p.ngay_ky)
                .sort((a, b) => new Date(b.ngay_ky!).getTime() - new Date(a.ngay_ky!).getTime())
                .slice(0, 5)
                .map((payroll, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">
                      {payroll.ho_ten}
                    </span>
                    <span className="text-gray-500">
                      {new Date(payroll.ngay_ky!).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default SignatureStats;
