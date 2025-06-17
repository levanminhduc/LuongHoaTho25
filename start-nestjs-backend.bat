@echo off
chcp 65001 >nul
title "Start NestJS Backend"
echo =========================================
echo        KHỞI ĐỘNG NESTJS BACKEND
echo =========================================
echo.

echo 🔧 Đang khởi động NestJS Backend...
echo.

echo [1/3] Kiểm tra thư mục backend-nestjs...
if not exist "backend-nestjs" (
    echo ❌ Không tìm thấy thư mục backend-nestjs
    pause
    exit /b 1
)
echo ✅ Thư mục backend-nestjs tồn tại

echo.
echo [2/3] Cài đặt dependencies (nếu cần)...
cd backend-nestjs
if not exist "node_modules" (
    echo 📦 Đang cài đặt dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Lỗi khi cài đặt dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies đã được cài đặt
) else (
    echo ℹ️  Dependencies đã tồn tại
)

echo.
echo [3/3] Khởi động NestJS server...
echo 🚀 Starting NestJS on port 4002...
echo 📚 API Docs sẽ có tại: http://localhost:4002/api/docs
echo 🏥 Health check: http://localhost:4002/api/health
echo.
echo 💡 Nhấn Ctrl+C để dừng server
echo.

npm run start:dev

pause
