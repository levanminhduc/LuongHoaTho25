@echo off
chcp 65001 >nul
title "NestJS Backend - Port 4002"
echo =========================================
echo    KHỞI ĐỘNG NESTJS BACKEND (PORT 4002)
echo =========================================
echo.

echo 🔧 Checking port 4002...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4002') do (
    if "%%a" neq "0" (
        echo   └─ Killing process %%a on port 4002
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo.
echo 🚀 Starting NestJS Backend...
cd backend-nestjs

echo 📦 Installing dependencies...
npm install

echo.
echo 🏗️ Building NestJS...
npm run build

echo.
echo 🚀 Starting development server...
echo 🌐 NestJS Backend: http://localhost:4002
echo 📚 API Docs: http://localhost:4002/api/docs
echo 🏥 Health Check: http://localhost:4002/api/health
echo.

npm run start:dev

pause
