import LoginForm from '@/components/forms/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>
        <LoginForm />
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Demo:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              <strong>Admin:</strong> admin / admin123
            </p>
            <p>
              <strong>Nhân viên:</strong> NV001 / 123456789012
            </p>
            <p>
              <strong>Nhân viên (mã số):</strong> 4211 / 123456789999
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 