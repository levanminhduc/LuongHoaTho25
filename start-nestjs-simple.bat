@echo off
title "NestJS Backend - Port 4002"
echo Starting NestJS Backend...

cd backend-nestjs
echo Installing dependencies...
call npm install

echo Building project...
call npm run build

echo Starting development server...
call npm run start:dev

pause
