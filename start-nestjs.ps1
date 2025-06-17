# Start NestJS Backend
Write-Host "🚀 Starting NestJS Backend (Port 4002)..." -ForegroundColor Green

# Kill existing process on port 4002
try {
    $processes = Get-NetTCPConnection -LocalPort 4002 -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "🔧 Killing existing process on port 4002..." -ForegroundColor Yellow
        $processes | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
        Start-Sleep -Seconds 2
    }
} catch {
    Write-Host "ℹ️ No existing process on port 4002" -ForegroundColor Blue
}

# Change to NestJS directory
Set-Location "backend-nestjs"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

# Build project
Write-Host "🏗️ Building NestJS..." -ForegroundColor Blue
npm run build

# Start development server
Write-Host "🚀 Starting NestJS development server..." -ForegroundColor Green
Write-Host "🌐 NestJS Backend: http://localhost:4002" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:4002/api/docs" -ForegroundColor Cyan
Write-Host "🏥 Health Check: http://localhost:4002/api/health" -ForegroundColor Cyan
Write-Host ""

npm run start:dev
