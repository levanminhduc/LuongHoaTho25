# PowerShell Script for Starting All Payroll Management Systems
# UTF-8 Encoding with BOM for Vietnamese support

param(
    [switch]$OnlyNew,
    [switch]$OnlyOld,
    [switch]$Help
)

if ($Help) {
    Write-Host @"
🚀 Payroll Management System Launcher

Usage:
  .\start-all-systems.ps1          # Start all systems
  .\start-all-systems.ps1 -OnlyNew # Start only new systems (Next.js + Express.js)
  .\start-all-systems.ps1 -OnlyOld # Start only old systems (React + Express.js)
  .\start-all-systems.ps1 -Help    # Show this help

Systems:
  Backend:  Express.js (Port 4001) - Main backend with SSE support
  Frontend: Next.js (Port 3000) - Modern frontend with real-time features
  Legacy:   React+Vite (Port 5173), NestJS (Port 4002)
"@
    exit 0
}

# Set console encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "🚀 Starting Payroll Management Systems" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host

# Function to kill process on port
function Kill-ProcessOnPort {
    param([int]$Port, [string]$ServiceName)
    
    Write-Host "📡 Cleaning up port $Port ($ServiceName)..." -ForegroundColor Blue
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | ForEach-Object { Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue }
        foreach ($process in $processes) {
            if ($process) {
                Write-Host "  └─ Killing process $($process.Id) ($($process.Name)) on port $Port" -ForegroundColor Gray
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
        }
    }
    catch {
        Write-Host "  └─ No processes found on port $Port" -ForegroundColor Gray
    }
}

# Function to start service in new window
function Start-ServiceWindow {
    param(
        [string]$Title,
        [string]$WorkingDirectory,
        [string]$Command,
        [string]$Icon,
        [int]$WaitSeconds = 3
    )
    
    Write-Host "[$Icon] $Title..." -ForegroundColor Green
    
    try {
        $fullPath = Join-Path (Get-Location) $WorkingDirectory
        if (-not (Test-Path $fullPath)) {
            Write-Host "  ❌ Directory not found: $fullPath" -ForegroundColor Red
            return $false
        }
        
        # Start new PowerShell window
        $arguments = "-NoExit", "-Command", "Set-Location '$fullPath'; Write-Host '🚀 Starting $Title...'; $Command"
        Start-Process -FilePath "powershell.exe" -ArgumentList $arguments -WindowStyle Normal
        
        Write-Host "  └─ Waiting $WaitSeconds seconds..." -ForegroundColor Gray
        Start-Sleep -Seconds $WaitSeconds
        return $true
    }
    catch {
        Write-Host "  ❌ Failed to start $Title : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Check if directories exist
$requiredDirs = @("backend", "frontend-nextjs")
if (-not $OnlyNew) {
    $requiredDirs += @("frontend", "backend-nestjs")
}

foreach ($dir in $requiredDirs) {
    if (-not (Test-Path $dir)) {
        Write-Host "❌ Required directory missing: $dir" -ForegroundColor Red
        Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "🔧 Checking and cleaning up ports..." -ForegroundColor Blue
Write-Host

# Clean up ports
Kill-ProcessOnPort -Port 4001 -ServiceName "Express.js"
if (-not $OnlyNew) {
    Kill-ProcessOnPort -Port 4002 -ServiceName "NestJS"
    Kill-ProcessOnPort -Port 5173 -ServiceName "React+Vite"
}
Kill-ProcessOnPort -Port 3000 -ServiceName "Next.js"

Write-Host
Write-Host "🎯 Port cleanup completed!" -ForegroundColor Green
Write-Host
Write-Host "⏰ Starting services in sequence..." -ForegroundColor Blue
Write-Host

$success = $true

# Start services based on parameters
if ($OnlyOld) {
    # Start only old systems
    $success = $success -and (Start-ServiceWindow -Title "Express.js Backend (Port 4001)" -WorkingDirectory "backend" -Command "npm run dev" -Icon "💻" -WaitSeconds 5)
    $success = $success -and (Start-ServiceWindow -Title "NestJS Backend (Port 4002)" -WorkingDirectory "backend-nestjs" -Command "npm run start:dev" -Icon "🏗️" -WaitSeconds 5)
    $success = $success -and (Start-ServiceWindow -Title "React+Vite Frontend (Port 5173)" -WorkingDirectory "frontend" -Command "npm run dev" -Icon "⚛️" -WaitSeconds 3)
}
elseif ($OnlyNew) {
    # Start only new systems  
    $success = $success -and (Start-ServiceWindow -Title "Express.js Backend (Port 4001)" -WorkingDirectory "backend" -Command "npm run dev" -Icon "💻" -WaitSeconds 5)
    $success = $success -and (Start-ServiceWindow -Title "Next.js Frontend (Port 3000)" -WorkingDirectory "frontend-nextjs" -Command "npm run dev" -Icon "⚡" -WaitSeconds 3)
}
else {
    # Start all systems
    $success = $success -and (Start-ServiceWindow -Title "Express.js Backend (Port 4001)" -WorkingDirectory "backend" -Command "npm run dev" -Icon "💻" -WaitSeconds 5)
    $success = $success -and (Start-ServiceWindow -Title "NestJS Backend (Port 4002)" -WorkingDirectory "backend-nestjs" -Command "npm run start:dev" -Icon "🏗️" -WaitSeconds 5)
    $success = $success -and (Start-ServiceWindow -Title "React+Vite Frontend (Port 5173)" -WorkingDirectory "frontend" -Command "npm run dev" -Icon "⚛️" -WaitSeconds 3)
    $success = $success -and (Start-ServiceWindow -Title "Next.js Frontend (Port 3000)" -WorkingDirectory "frontend-nextjs" -Command "npm run dev" -Icon "⚡" -WaitSeconds 3)
}

Write-Host
if ($success) {
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "✅ All systems are starting up!" -ForegroundColor Green
    Write-Host "===========================================" -ForegroundColor Cyan
} else {
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "⚠️  Some systems failed to start!" -ForegroundColor Yellow
    Write-Host "===========================================" -ForegroundColor Cyan
}

Write-Host
Write-Host "🌐 Backend Services:" -ForegroundColor Blue
Write-Host "  💻 Express.js (Cũ):    http://localhost:4001" -ForegroundColor White
if (-not $OnlyNew) {
    Write-Host "  🏗️  NestJS (Mới):       http://localhost:4002" -ForegroundColor White
}
Write-Host

Write-Host "🖼️  Frontend Applications:" -ForegroundColor Blue
if (-not $OnlyNew) {
    Write-Host "  ⚛️  React+Vite (Cũ):   http://localhost:5173" -ForegroundColor White
}
Write-Host "  ⚡ Next.js (Mới):      http://localhost:3000" -ForegroundColor White
Write-Host

Write-Host "📚 API Documentation:" -ForegroundColor Blue
Write-Host "  📖 Express.js Docs:    http://localhost:4001/api/docs" -ForegroundColor White
if (-not $OnlyNew) {
    Write-Host "  📖 NestJS Docs:        http://localhost:4002/api" -ForegroundColor White
}
Write-Host

Write-Host "🏥 Health Checks:" -ForegroundColor Blue
Write-Host "  💓 Express.js Health:  http://localhost:4001/api/health" -ForegroundColor White
if (-not $OnlyNew) {
    Write-Host "  💓 NestJS Health:      http://localhost:4002/health" -ForegroundColor White
}
Write-Host

Write-Host "🎯 Recommended Workflow:" -ForegroundColor Blue
Write-Host "  1️⃣  Use Next.js (Port 3000) for new features" -ForegroundColor White
Write-Host "  2️⃣  Use Express.js (Port 4001) as main backend" -ForegroundColor White
if (-not $OnlyNew) {
    Write-Host "  3️⃣  NestJS (Port 4002) available as fallback" -ForegroundColor White
}
Write-Host

Write-Host "🚨 To stop all services: Close all PowerShell windows or press Ctrl+C in each" -ForegroundColor Yellow
Write-Host

Write-Host "Press any key to exit this launcher..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 