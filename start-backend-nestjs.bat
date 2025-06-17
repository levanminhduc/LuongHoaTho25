@echo off
title "NestJS Backend Server"
echo =========================================
echo     KHOI DONG NESTJS BACKEND SERVER
echo =========================================
echo.

echo [INFO] Kiem tra Node.js...
node --version
if %errorlevel% neq 0 (
    echo [ERROR] Node.js chua duoc cai dat!
    echo Vui long cai dat Node.js truoc khi chay ung dung.
    pause
    exit /b 1
)

echo [INFO] Di chuyen den thu muc backend-nestjs...
cd /d "%~dp0backend-nestjs"

echo [INFO] Kiem tra file .env...
if not exist ".env" (
    echo [WARNING] Khong tim thay file .env, copy tu env.example...
    copy env.example .env
)

echo [INFO] Khoi dong NestJS server...
echo [INFO] Server se chay tai: http://localhost:4002
echo [INFO] API Documentation: http://localhost:4002/api/docs
echo.

npm run start:dev

pause 