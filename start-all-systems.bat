@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ===========================================
echo 🚀 Starting All Payroll Management Systems
echo ===========================================

echo.
echo 🔧 Checking and cleaning up ports...
echo.

:: Kill processes on required ports
echo 📡 Cleaning up port 4001 (Express.js)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4001') do (
    if "%%a" neq "0" (
        echo   └─ Killing process %%a on port 4001
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo 📡 Cleaning up port 4002 (NestJS)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4002') do (
    if "%%a" neq "0" (
        echo   └─ Killing process %%a on port 4002
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo 📡 Cleaning up port 3000 (Next.js)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    if "%%a" neq "0" (
        echo   └─ Killing process %%a on port 3000
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo 📡 Cleaning up port 5173 (React+Vite)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    if "%%a" neq "0" (
        echo   └─ Killing process %%a on port 5173
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo.
echo 🎯 Port cleanup completed!
echo.

:: Wait a moment for ports to be released
timeout /t 2 /nobreak >nul

echo ⏰ Starting services in sequence...
echo.

echo [1/4] 🖥️  Starting Express.js Backend (Port 4001)...
start "💻 Express Backend (4001)" cmd /k "title Express Backend (4001) && cd backend && echo 🚀 Starting Express.js... && npm run dev"

:: Wait for Express to start
echo   └─ Waiting for Express.js to start...
timeout /t 5 /nobreak >nul

echo.
echo [2/4] 🏗️  Starting NestJS Backend (Port 4002)...
start "🏗️ NestJS Backend (4002)" cmd /k "title NestJS Backend (4002) && cd backend-nestjs && echo 🚀 Starting NestJS... && npm run start:dev"

:: Wait for NestJS to start
echo   └─ Waiting for NestJS to start...
timeout /t 5 /nobreak >nul

echo.
echo [3/4] ⚛️  Starting React+Vite Frontend (Port 5173)...
start "⚛️ React Frontend (5173)" cmd /k "title React Frontend (5173) && cd frontend && echo 🚀 Starting React+Vite... && npm run dev"

:: Wait for React to start
echo   └─ Waiting for React+Vite to start...
timeout /t 3 /nobreak >nul

echo.
echo [4/4] ⚡ Starting Next.js Frontend (Port 3000)...
start "⚡ Next.js Frontend (3000)" cmd /k "title Next.js Frontend (3000) && cd frontend-nextjs && echo 🚀 Starting Next.js... && npm run dev"

:: Wait for Next.js to start
echo   └─ Waiting for Next.js to start...
timeout /t 3 /nobreak >nul

echo.
echo ===========================================
echo ✅ All systems are starting up!
echo ===========================================
echo.
echo 🌐 Backend Services:
echo   💻 Express.js (Cũ):    http://localhost:4001
echo   🏗️  NestJS (Mới):       http://localhost:4002
echo.
echo 🖼️  Frontend Applications:
echo   ⚛️  React+Vite (Cũ):   http://localhost:5173
echo   ⚡ Next.js (Mới):      http://localhost:3000
echo.
echo 📚 API Documentation:
echo   📖 Express.js Docs:    http://localhost:4001/api/docs
echo   📖 NestJS Docs:        http://localhost:4002/api
echo.
echo 🏥 Health Checks:
echo   💓 Express.js Health:  http://localhost:4001/api/health
echo   💓 NestJS Health:      http://localhost:4002/health
echo.
echo 🎯 Recommended Workflow:
echo   1️⃣  Use Next.js (Port 3000) for new features
echo   2️⃣  Use Express.js (Port 4001) as main backend
echo   3️⃣  NestJS (Port 4002) available as fallback
echo.
echo 🚨 To stop all services: Close all command windows or press Ctrl+C in each
echo.
echo Press any key to exit this launcher...
pause >nul 