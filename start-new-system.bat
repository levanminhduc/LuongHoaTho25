@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ===========================================
echo ⚡ Starting NEW Payroll Management System
echo ===========================================
echo.
echo 🎯 Starting Next.js + Express.js (Recommended)
echo.

:: Kill processes on required ports
echo 📡 Cleaning up ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4001') do (
    if "%%a" neq "0" (
        echo   └─ Killing process %%a on port 4001
        taskkill /PID %%a /F >nul 2>&1
    )
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    if "%%a" neq "0" (
        echo   └─ Killing process %%a on port 3000
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo   └─ Port cleanup completed!
echo.

:: Wait for ports to be released
timeout /t 2 /nobreak >nul

echo 💻 Starting Express.js Backend (Port 4001)...
start "💻 Express Backend (4001)" cmd /k "title Express Backend (4001) && cd backend && echo 🚀 Express.js with SSE support... && npm run dev"

echo   └─ Waiting for Express.js to start...
timeout /t 5 /nobreak >nul

echo.
echo ⚡ Starting Next.js Frontend (Port 3000)...
start "⚡ Next.js Frontend (3000)" cmd /k "title Next.js Frontend (3000) && cd frontend-nextjs && echo 🚀 Next.js with real-time features... && npm run dev"

echo   └─ Waiting for Next.js to start...
timeout /t 3 /nobreak >nul

echo.
echo ===========================================
echo ✅ NEW System is starting up!
echo ===========================================
echo.
echo 🌐 Access URLs:
echo   💻 Backend (Express.js):   http://localhost:4001
echo   ⚡ Frontend (Next.js):     http://localhost:3000
echo.
echo 📚 Documentation:
echo   📖 API Docs:               http://localhost:4001/api/docs
echo   💓 Health Check:           http://localhost:4001/api/health
echo.
echo ✨ Features Available:
echo   🔐 JWT Authentication
echo   📊 Role-based Access Control  
echo   📡 Real-time SSE Notifications
echo   💰 Payroll Management
echo   👥 Employee Management
echo   📄 Excel Import/Export
echo.
echo 🎯 Login Credentials:
echo   Admin:    admin / admin123
echo   Employee: NV001 / 123456789012
echo.
echo Press any key to exit this launcher...
pause >nul 