import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from 'lucide-react';
import { payrollService } from '@/services/payrollService';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ImportExcel: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);

  const importMutation = useMutation({
    mutationFn: payrollService.importExcel,
    onSuccess: (data) => {
      setImportResult(data.data);
      toast.success(data.message);
      setSelectedFile(null);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Import thất bại';
      toast.error(message);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setImportResult(null);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error('File quá lớn. Kích thước tối đa là 10MB');
      } else if (error?.code === 'file-invalid-type') {
        toast.error('Chỉ chấp nhận file Excel (.xls, .xlsx)');
      } else {
        toast.error('File không hợp lệ');
      }
    },
  });

  const handleImport = () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file Excel');
      return;
    }
    importMutation.mutate(selectedFile);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImportResult(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Import Excel</h1>
        <p className="text-gray-600">Tải lên file Excel chứa dữ liệu bảng lương</p>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Hướng dẫn sử dụng
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Chuẩn bị file Excel</p>
                <p className="text-sm text-gray-600">
                  File Excel cần có các cột: ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Tải lên file</p>
                <p className="text-sm text-gray-600">
                  Kéo thả file vào khung bên dưới hoặc click để chọn file
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Xác nhận import</p>
                <p className="text-sm text-gray-600">
                  Kiểm tra thông tin file và nhấn "Import" để xử lý
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Chọn file Excel
          </h3>
        </CardHeader>
        <CardBody>
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-lg text-primary-600">Thả file vào đây...</p>
              ) : (
                <div>
                  <p className="text-lg text-gray-900 mb-2">
                    Kéo thả file Excel vào đây
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    hoặc <span className="text-primary-600 font-medium">click để chọn file</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Chỉ chấp nhận file .xls, .xlsx (tối đa 10MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {selectedFile && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleImport}
                loading={importMutation.isPending}
                disabled={importMutation.isPending}
              >
                {importMutation.isPending ? 'Đang import...' : 'Import dữ liệu'}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Import Result */}
      {importResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Kết quả import
              </h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {importResult.totalRows}
                </div>
                <div className="text-sm text-blue-800">Tổng số dòng</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {importResult.successCount}
                </div>
                <div className="text-sm text-green-800">Thành công</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {importResult.errorCount}
                </div>
                <div className="text-sm text-red-800">Lỗi</div>
              </div>
            </div>

            {importResult.errors && importResult.errors.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <h4 className="text-sm font-medium text-red-800">
                    Chi tiết lỗi:
                  </h4>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <ul className="text-sm text-red-700 space-y-1">
                    {importResult.errors.map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ImportExcel;
