# 🚀 Payroll Management System - Startup Guide

Hướng dẫn khởi động hệ thống quản lý lương với các tùy chọn khác nhau.

## 📋 Tổng quan hệ thống

### 🌐 Backend Services

- **Express.js (Port 4001)** - Backend chính với SSE support
- **NestJS (Port 4002)** - Backend phụ (fallback)

### 🖼️ Frontend Applications

- **Next.js (Port 3000)** - Frontend mới với real-time features ⭐ **RECOMMENDED**
- **React+Vite (Port 5173)** - Frontend cũ (legacy)

## 🎯 Phương thức khởi động

### 1. ⚡ **Quick Start - Hệ thống mới (RECOMMENDED)**

```bash
# Batch script (Windows)
.\start-new-system.bat

# Or PowerShell
.\start-all-systems.ps1 -OnlyNew

# Or npm script
npm run start:new-system
```

**Khởi động:**

- ✅ Express.js Backend (Port 4001)
- ✅ Next.js Frontend (Port 3000)

### 2. 🌍 **Full System - Tất cả dịch vụ**

```bash
# Batch script (Windows)
.\start-all-systems.bat

# Or PowerShell
.\start-all-systems.ps1

# Or npm script
npm run start:all-systems
```

**Khởi động:**

- ✅ Express.js Backend (Port 4001)
- ✅ NestJS Backend (Port 4002)
- ✅ React+Vite Frontend (Port 5173)
- ✅ Next.js Frontend (Port 3000)

### 3. 🔧 **Manual Start**

```bash
# Backend only
npm run dev:backend

# Next.js only
npm run dev:nextjs

# New system combination
npm run dev:new

# All systems
npm run dev:all
```

## 🎛️ PowerShell Options

PowerShell script có các tùy chọn nâng cao:

```powershell
# Help
.\start-all-systems.ps1 -Help

# Chỉ hệ thống mới
.\start-all-systems.ps1 -OnlyNew

# Chỉ hệ thống cũ
.\start-all-systems.ps1 -OnlyOld
```

## 🌐 Access URLs

### Frontend Applications

- **Next.js (Mới):** http://localhost:3000 ⭐
- **React+Vite (Cũ):** http://localhost:5173

### Backend APIs

- **Express.js API:** http://localhost:4001
- **NestJS API:** http://localhost:4002

### Documentation

- **Express.js Docs:** http://localhost:4001/api/docs
- **NestJS Docs:** http://localhost:4002/api

### Health Checks

- **Express.js Health:** http://localhost:4001/api/health
- **NestJS Health:** http://localhost:4002/health

## 🔑 Login Credentials

### Admin Account

- **Username:** `admin`
- **Password:** `admin123`

### Employee Account

- **Username:** `NV001`
- **Password:** `123456789012`

## ✨ Features Available

### 🎯 Next.js Frontend (Port 3000) - RECOMMENDED

- 🔐 JWT Authentication
- 📊 Role-based Access Control
- 📡 Real-time SSE Notifications
- 💰 Payroll Management
- 👥 Employee Management
- 📄 Excel Import/Export
- 🎨 Modern UI with Shadcn/UI
- 📱 Responsive Design

### 🖥️ Express.js Backend (Port 4001) - MAIN BACKEND

- 🔐 JWT Authentication with caching
- 📡 Server-Sent Events (SSE)
- 💾 MySQL Database
- 📊 Payroll CRUD operations
- 👥 Employee management
- 📄 Excel import/export
- 🏥 Health monitoring
- 📚 Swagger documentation

## 🚨 Troubleshooting

### Port Conflicts

Scripts tự động kill processes trên ports yêu cầu. Nếu vẫn có lỗi:

```bash
# Check ports manually
netstat -ano | findstr :4001
netstat -ano | findstr :3000

# Kill specific process
taskkill /PID <PID> /F
```

### PowerShell Execution Policy

Nếu PowerShell script không chạy được:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Database Connection

Đảm bảo MySQL đang chạy và database đã được setup:

```bash
# Seed database if needed
npm run seed
```

## 📁 Project Structure

```
payroll-management-system/
├── backend/                 # Express.js backend (Port 4001)
├── backend-nestjs/          # NestJS backend (Port 4002)
├── frontend/                # React+Vite frontend (Port 5173)
├── frontend-nextjs/         # Next.js frontend (Port 3000) ⭐
├── start-all-systems.bat    # Batch script - all systems
├── start-all-systems.ps1    # PowerShell script with options
├── start-new-system.bat     # Quick start - new system only
└── package.json             # Root package with npm scripts
```

## 🎯 Recommended Workflow

1. **Development:** Use Next.js (Port 3000) + Express.js (Port 4001)
2. **Testing:** Use `start-new-system.bat` for quick startup
3. **Full Testing:** Use `start-all-systems.bat` for complete system
4. **Production:** Deploy Next.js + Express.js combination

## 🔄 Updates

- ✅ **Port conflict resolution** - Auto-kill existing processes
- ✅ **Sequential startup** - Proper service startup order
- ✅ **Error handling** - Better error messages and recovery
- ✅ **UTF-8 support** - Vietnamese characters properly displayed
- ✅ **Multiple options** - Different startup combinations available

---

**🎉 Hệ thống đã được tối ưu hóa với real-time SSE notifications và performance improvements!**
