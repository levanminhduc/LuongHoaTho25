@echo off
echo ========================================
echo       KHOI DONG BACKEND SERVER
echo ========================================
echo.

echo [1/3] Kiem tra Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js chua duoc cai dat. Vui long cai dat Node.js tu https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js da san sang

echo.
echo [2/3] Kiem tra file cau hinh...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo ✅ Da tao backend\.env
) else (
    echo ℹ️  backend\.env da ton tai
)

echo.
echo [3/3] Cai dat dependencies va khoi dong...
cd backend

if not exist "node_modules" (
    echo 📦 Dang cai dat dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Loi khi cai dat dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies da duoc cai dat
)

echo.
echo 🚀 Khoi dong Backend Server...
echo 🔧 Backend API: http://localhost:4001/api
echo 📚 API Docs: http://localhost:4001/api/docs
echo 🌐 Health Check: http://localhost:4001/api/health
echo.
echo � THONG TIN QUAN TRONG:
echo ✅ Backend se chay tren port 4001
echo ✅ Frontend can ket noi den port 4001
echo ✅ Tinh nang ky xac nhan da duoc them vao
echo.
echo �💡 Nhan Ctrl+C de dung server
echo ⚠️  Dam bao frontend dang chay de test day du
echo.

node src/index.js

pause
