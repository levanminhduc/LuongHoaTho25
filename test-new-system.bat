@echo off
chcp 65001 >nul
title "Test NEW System Connection"
echo =========================================
echo        TEST HỆ THỐNG MỚI - LIÊN KẾT
echo =========================================
echo.

echo [TEST 1] Kiểm tra NestJS Backend (Port 4002)...
curl -s http://localhost:4002/api/health
if %errorlevel% equ 0 (
    echo ✅ NestJS Backend đang hoạt động!
) else (
    echo ❌ NestJS Backend không hoạt động hoặc chưa khởi động
    echo    Hãy chạy: npm run start:dev trong thư mục backend-nestjs
)

echo.
echo [TEST 2] Kiểm tra Next.js Frontend (Port 3000)...
curl -s http://localhost:3000 >nul
if %errorlevel% equ 0 (
    echo ✅ Next.js Frontend đang hoạt động!
) else (
    echo ❌ Next.js Frontend không hoạt động hoặc chưa khởi động
    echo    Hãy chạy: npm run dev trong thư mục frontend-nextjs
)

echo.
echo [TEST 3] Test API Login với NestJS...
curl -X POST http://localhost:4002/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

echo.
echo.
echo [TEST 4] Test API Documentation...
echo 📚 NestJS API Docs: http://localhost:4002/api/docs
echo 🌐 Frontend App: http://localhost:3000

echo.
echo =========================================
echo           KIỂM TRA LIÊN KẾT
echo =========================================
echo.
echo ✅ Nếu tất cả test đều PASS:
echo    - Frontend NextJS đã liên kết với Backend NestJS
echo    - Có thể đăng nhập và sử dụng hệ thống
echo.
echo ❌ Nếu có test FAIL:
echo    - Kiểm tra lại cấu hình port
echo    - Đảm bảo cả hai service đang chạy
echo    - Xem log lỗi trong terminal
echo.

pause
