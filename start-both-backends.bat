@echo off
title "Khoi dong ca hai Backend Systems"
echo =========================================
echo      KHOI DONG CA HAI HE THONG BACKEND
echo =========================================
echo.
echo [INFO] Express.js Backend: http://localhost:4001
echo [INFO] NestJS Backend:    http://localhost:4002
echo.

echo [INFO] Khoi dong Express.js Backend (Port 4001)...
start "Express.js Backend" cmd /k "cd backend && npm run dev"

echo [INFO] Cho 3 giay...
timeout 3 >nul

echo [INFO] Khoi dong NestJS Backend (Port 4002)...
start "NestJS Backend" cmd /k "cd backend-nestjs && npm install && npm run start:dev"

echo.
echo =========================================
echo         CA HAI BACKEND DANG KHOI DONG
echo =========================================
echo.
echo [URLs] Kiem tra cac endpoint:
echo   Express.js Health: http://localhost:4001/api/health
echo   Express.js Docs:   http://localhost:4001/api/docs
echo.
echo   NestJS Health:     http://localhost:4002/api/health  
echo   NestJS Docs:       http://localhost:4002/api/docs
echo.
echo [INFO] Nhan phim bat ky de dong script nay...
echo [INFO] Cac server se tiep tuc chay trong cua so rieng.

pause 