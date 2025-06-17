@echo off
title "Test ca hai Backend Systems"
echo =========================================
echo        TEST CA HAI HE THONG BACKEND
echo =========================================
echo.

echo [TEST] Kiem tra Express.js Backend (Port 4001)...
curl -s http://localhost:4001/api/health
if %errorlevel% equ 0 (
    echo [SUCCESS] Express.js dang hoat dong!
) else (
    echo [ERROR] Express.js khong hoat dong hoac chua khoi dong
)

echo.
echo [TEST] Kiem tra NestJS Backend (Port 4002)...
curl -s http://localhost:4002/api/health
if %errorlevel% equ 0 (
    echo [SUCCESS] NestJS dang hoat dong!
) else (
    echo [ERROR] NestJS khong hoat dong hoac chua khoi dong
)

echo.
echo =========================================
echo            KET QUA TEST
echo =========================================
echo.
echo [URLs] Neu ca hai deu hoat dong:
echo   Express.js: http://localhost:4001/api/docs
echo   NestJS:     http://localhost:4002/api/docs
echo.

pause 