@echo off
echo ========================================
echo   HE THONG QUAN LY LUONG - KHOI DONG
echo ========================================
echo.

echo [1/6] Kiem tra Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js chua duoc cai dat. Vui long cai dat Node.js tu https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js da san sang

echo.
echo [2/6] Kiem tra npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm chua duoc cai dat.
    pause
    exit /b 1
)
echo ✅ npm da san sang

echo.
echo [3/6] Sao chep file cau hinh...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo ✅ Da tao backend\.env
) else (
    echo ℹ️  backend\.env da ton tai
)

echo.
echo [4/6] Cai dat dependencies cho Backend...
cd backend
if not exist "node_modules" (
    echo 📦 Dang cai dat backend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Loi khi cai dat backend dependencies
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies da duoc cai dat
) else (
    echo ℹ️  Backend dependencies da ton tai
)
cd ..

echo.
echo [5/6] Cai dat dependencies cho Frontend...
cd frontend
if not exist "node_modules" (
    echo 📦 Dang cai dat frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Loi khi cai dat frontend dependencies
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies da duoc cai dat
) else (
    echo ℹ️  Frontend dependencies da ton tai
)
cd ..

echo.
echo [6/6] Khoi dong he thong...
echo 🚀 Dang khoi dong Backend va Frontend...
echo.
echo ⚠️  LUU Y: He thong se mo 2 cua so terminal:
echo    - Terminal 1: Backend (Node.js)
echo    - Terminal 2: Frontend (Vite)
echo.
echo 📝 Khong dong cac cua so terminal de he thong hoat dong!
echo.
pause

echo Khoi dong Backend...
start "Backend Server" cmd /k "cd backend && node src/index.js"
timeout /t 3 /nobreak >nul

echo Khoi dong Frontend...
start "Frontend Server" cmd /k "cd frontend && npx vite"

echo.
echo ========================================
echo   HE THONG DA KHOI DONG THANH CONG!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:4000/api
echo 📚 API Docs: http://localhost:4000/api/docs
echo.
echo 👤 Thong tin dang nhap:
echo    Admin: admin / admin123
echo    Nhan vien: NV001-NV005 (mat khau = ma NV)
echo.
echo 💡 Meo: Nhan Ctrl+C trong cac cua so terminal de dung he thong
echo.
pause
