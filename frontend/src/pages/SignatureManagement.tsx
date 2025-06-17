import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import SignatureStats from '@/components/SignatureStats';
import SignatureHistory from '@/components/SignatureHistory';

const SignatureManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  📝 Quản lý ký nhận lương
                </h1>
                <p className="text-sm text-gray-600">
                  Theo dõi và quản lý việc ký nhận lương của nhân viên
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Statistics */}
          <SignatureStats />

          {/* History */}
          <SignatureHistory />
        </div>
      </div>
    </div>
  );
};

export default SignatureManagement;
