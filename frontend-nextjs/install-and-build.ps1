# PowerShell script to install dependencies and build
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install --no-optional --legacy-peer-deps

Write-Host "Building application..." -ForegroundColor Green  
npm run build

Write-Host "Build completed!" -ForegroundColor Green
