@echo off
echo ========================================
echo    HE THONG QUAN LY LUONG - KHOI DONG
echo ========================================
echo.

echo 🎯 Khoi dong ca Backend va Frontend...
echo.

echo [1/4] Kiem tra Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js chua duoc cai dat. Vui long cai dat Node.js tu https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js da san sang

echo.
echo [2/4] Tao file cau hinh...

REM Tao .env cho backend
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul 2>&1
    echo ✅ Da tao backend\.env
) else (
    echo ℹ️  backend\.env da ton tai
)

REM Tao .env cho frontend
if not exist "frontend\.env" (
    echo VITE_API_BASE_URL=http://localhost:4001/api > "frontend\.env"
    echo ✅ Da tao frontend\.env
) else (
    echo ℹ️  frontend\.env da ton tai
)

echo.
echo [3/4] Khoi dong Backend Server...
echo 🔧 Backend se chay tren: http://localhost:4001/api
start "Backend Server" cmd /k "cd backend && npm install >nul 2>&1 && echo ✅ Backend dependencies ready && node src/index.js"

echo.
echo ⏳ Cho Backend khoi dong (5 giay)...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Khoi dong Frontend Server...
echo 🌐 Frontend se chay tren: http://localhost:5173
start "Frontend Server" cmd /k "cd frontend && npm install >nul 2>&1 && echo ✅ Frontend dependencies ready && npx vite"

echo.
echo ========================================
echo           KHOI DONG HOAN TAT
echo ========================================
echo.
echo 🎉 He thong da duoc khoi dong thanh cong!
echo.
echo 📋 THONG TIN TRUY CAP:
echo 🔧 Backend API: http://localhost:4001/api
echo 📚 API Docs: http://localhost:4001/api/docs
echo 🌐 React App: http://localhost:5173
echo 🔗 Simple Login: http://localhost:5173/simple-login
echo 📊 Dashboard: http://localhost:5173/simple-dashboard
echo.
echo 👤 TAI KHOAN DEMO:
echo Admin: admin / admin123
echo Nhan vien: NV001 / 123456789012 (CCCD)
echo.
echo ✍️  TINH NANG KY XAC NHAN:
echo - Da duoc them vao dashboard
echo - Click nut "Ky xac nhan" de test
echo.
echo 💡 Nhan phim bat ky de dong cua so nay...
echo ⚠️  Khong dong cac cua so Backend va Frontend!
echo.

pause
