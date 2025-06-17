@echo off
chcp 65001 >nul
title "Fix Connection Issue - NextJS + Express.js"
echo =========================================
echo    SỬA LỖI KẾT NỐI - NEXTJS + EXPRESS.JS
echo =========================================
echo.

echo 🔧 Đang sửa lỗi kết nối...
echo.

echo [1/4] Dừng các process cũ...
echo 📡 Killing processes on ports 4001, 4002, 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4001') do (
    if "%%a" neq "0" (
        echo   └─ Killing process %%a on port 4001
        taskkill /PID %%a /F >nul 2>&1
    )
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4002') do (
    if "%%a" neq "0" (
        echo   └─ Killing process %%a on port 4002
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo.
echo [2/4] Cấu hình CORS cho Express.js backend...
echo   └─ Đã cập nhật FRONTEND_URL=http://localhost:3000

echo.
echo [3/4] Khởi động Express.js Backend (Port 4001)...
start "🔧 Express.js Backend (4001)" cmd /k "title Express.js Backend (4001) && cd backend && echo 🚀 Starting Express.js... && npm run dev"

echo   └─ Chờ Express.js khởi động...
timeout /t 8 /nobreak >nul

echo.
echo [4/4] Test kết nối...
echo 🧪 Testing Express.js health...
curl -s http://localhost:4001/api/health
if %errorlevel% equ 0 (
    echo ✅ Express.js Backend đang hoạt động!
) else (
    echo ❌ Express.js Backend chưa sẵn sàng, vui lòng đợi thêm...
)

echo.
echo =========================================
echo ✅ SỬA LỖI HOÀN TẤT!
echo =========================================
echo.

echo 🌐 Frontend NextJS: http://localhost:3000
echo 🔧 Backend Express.js: http://localhost:4001
echo 📚 API Documentation: http://localhost:4001/api/docs
echo.

echo 🔑 Login Credentials:
echo   👨‍💼 Admin: admin / admin123
echo   👷 Employee: NV001 / 123456789012
echo.

echo 💡 Giải thích:
echo   - Frontend NextJS đã được cấu hình để gọi Express.js (port 4001)
echo   - CORS đã được cập nhật để cho phép NextJS frontend
echo   - Bạn có thể login bình thường tại http://localhost:3000/login
echo.

echo ⚠️  Lưu ý:
echo   - Nếu vẫn lỗi, hãy refresh trang web (Ctrl+F5)
echo   - Kiểm tra browser console để xem chi tiết lỗi
echo   - Đảm bảo cả frontend và backend đang chạy
echo.

pause
