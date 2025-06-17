# 🔄 HƯỚNG DẪN CHẠY CẢ HAI BACKEND

## 🚀 CÁCH KHỞI ĐỘNG

### **🎯 Option 1: Chạy cả hai cùng lúc**
```bash
./start-both-backends.bat
```
Script này sẽ mở 2 cửa sổ terminal riêng biệt cho mỗi backend.

### **🎯 Option 2: Chạy từng cái riêng**

#### **Express.js Backend (Hệ thống cũ)**
```bash
./start-backend.bat
# hoặc
cd backend
npm run dev
```

#### **NestJS Backend (Hệ thống mới)**
```bash
./start-backend-nestjs.bat  
# hoặc
cd backend-nestjs
npm install
npm run start:dev
```

## 🌐 **ENDPOINTS SO SÁNH**

### **Express.js (Port 4001)**
| Endpoint | URL |
|----------|-----|
| 🏥 Health Check | http://localhost:4001/api/health |
| 🔐 Login | http://localhost:4001/api/auth/login |
| 📊 Import Excel | http://localhost:4001/api/import/salary |
| 📚 API Docs | http://localhost:4001/api/docs |

### **NestJS (Port 4002)**  
| Endpoint | URL |
|----------|-----|
| 🏥 Health Check | http://localhost:4002/api/health |
| 🔐 Login | http://localhost:4002/api/auth/login |
| 📊 Import Excel | http://localhost:4002/api/import/salary |
| 📚 API Docs | http://localhost:4002/api/docs |

## 🧪 **TEST CẢ HAI HỆ THỐNG**

### **Script test tự động:**
```bash
./test-both-backends.bat
```

### **Test manual bằng browser:**
1. Mở http://localhost:4001/api/health (Express.js)
2. Mở http://localhost:4002/api/health (NestJS)
3. So sánh response

### **Test bằng curl:**
```bash
# Test Express.js
curl http://localhost:4001/api/health

# Test NestJS  
curl http://localhost:4002/api/health
```

## 📊 **SO SÁNH RESPONSE**

### **Express.js Health Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-12-15T16:45:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### **NestJS Health Response:**
```json
{
  "status": "OK", 
  "message": "NestJS Server đang hoạt động",
  "timestamp": "2024-12-15T16:45:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "2.0.0"
}
```

## 🔍 **API DOCUMENTATION COMPARISON**

### **Express.js Swagger:**
- URL: http://localhost:4001/api/docs
- Tính năng: Basic Swagger setup
- Cấu trúc: Manual configuration

### **NestJS Swagger:**
- URL: http://localhost:4002/api/docs  
- Tính năng: Auto-generated từ decorators
- Cấu trúc: Modular, typed responses

## 🧪 **TEST LOGIN API**

### **Express.js Login:**
```bash
curl -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### **NestJS Login:**
```bash
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \  
  -d '{"username":"admin","password":"admin123"}'
```

## 📈 **PERFORMANCE COMPARISON**

| Metric | Express.js | NestJS |
|--------|------------|--------|
| **Startup Time** | ~2-3s | ~5-7s |
| **Memory Usage** | ~50MB | ~80MB |
| **Response Time** | ~10ms | ~15ms |
| **Type Safety** | ❌ | ✅ |
| **Auto Documentation** | ❌ | ✅ |
| **Architecture** | Simple | Enterprise |

## 🔧 **TROUBLESHOOTING**

### **Common Issues:**

#### **Port Conflicts:**
```bash
# Kiểm tra port đang sử dụng
netstat -ano | findstr :4001
netstat -ano | findstr :4002

# Kill process nếu cần
taskkill /PID <process_id> /F
```

#### **Database Connection:**
- Đảm bảo MySQL đang chạy
- Kiểm tra credentials trong .env files
- Database `quan_ly_luong` phải tồn tại

#### **Dependencies:**
```bash
# Express.js
cd backend
npm install

# NestJS
cd backend-nestjs  
npm install
```

## 🎯 **MIGRATION STRATEGY**

### **Phase 1: Parallel Running**
- ✅ Chạy cả hai hệ thống song song
- ✅ Test và compare functionality
- ✅ Validate API compatibility

### **Phase 2: Feature Comparison**
- [ ] Test import functionality trên cả hai
- [ ] Compare performance metrics
- [ ] Validate data consistency

### **Phase 3: Gradual Migration**
- [ ] Switch một số APIs sang NestJS
- [ ] Monitor performance và stability  
- [ ] Feedback và improvements

## 📝 **NOTES**

- **Database shared**: Cả hai hệ thống dùng chung database
- **Authentication compatible**: JWT tokens tương thích
- **API structure similar**: Dễ dàng switch giữa các endpoints
- **Independent deployment**: Có thể deploy riêng biệt

## 🆘 **SUPPORT**

Nếu gặp vấn đề:
1. ✅ Kiểm tra cả hai server đang chạy
2. ✅ Verify database connection  
3. ✅ Check port conflicts
4. ✅ Compare API responses
5. ✅ Review logs trong terminal 