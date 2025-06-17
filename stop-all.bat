@echo off
echo ========================================
echo    HE THONG QUAN LY LUONG - DUNG LAI
echo ========================================
echo.

echo 🛑 Dang dung tat ca cac server...
echo.

echo [1/3] Dung Backend Server (port 4001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4001') do (
    taskkill /f /pid %%a >nul 2>&1
    echo ✅ Da dung Backend Server
)

echo.
echo [2/3] Dung Frontend Server (port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /f /pid %%a >nul 2>&1
    echo ✅ Da dung Frontend Server
)

echo.
echo [3/3] Dung tat ca Node.js processes...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Da dung tat ca Node.js processes

echo.
echo ========================================
echo           DUNG LAI HOAN TAT
echo ========================================
echo.
echo 🎉 Tat ca server da duoc dung lai!
echo.
echo 💡 Ban co the chay start-all.bat de khoi dong lai
echo.

pause
