@echo off
echo ========================================
echo       KHOI DONG FRONTEND SERVER
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
if not exist "frontend\.env" (
    echo VITE_API_BASE_URL=http://localhost:4001/api > "frontend\.env"
    echo ✅ Da tao frontend\.env
) else (
    echo ℹ️  frontend\.env da ton tai
)

echo.
echo [3/3] Cai dat dependencies va khoi dong...
cd frontend

if not exist "node_modules" (
    echo 📦 Dang cai dat dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Loi khi cai dat dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies da duoc cai dat
) else (
    echo ℹ️  Dependencies da ton tai
)

echo.
echo 🚀 Khoi dong Frontend Server...
echo 🌐 React App: http://localhost:5173
echo 🔗 Simple Login: http://localhost:5173/simple-login
echo 📊 Simple Dashboard: http://localhost:5173/simple-dashboard
echo ✍️  Tinh nang ky xac nhan: Da duoc them vao dashboard
echo.
echo 💡 Nhan Ctrl+C de dung server
echo ⚠️  Luu y: Frontend chay tren port 5173
echo 🔧 Dam bao backend dang chay tren port 4001
echo.

npx vite

pause
