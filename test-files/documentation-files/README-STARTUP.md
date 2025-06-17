# 🚀 Hướng Dẫn Khởi Động Hệ Thống Quản Lý Lương

## 📁 Các File Khởi Động

### 🎯 **start-all.bat** - Khởi động toàn bộ hệ thống
```bash
# Khởi động cả Backend và Frontend cùng lúc
start-all.bat
```

### 🔧 **start-backend.bat** - Chỉ khởi động Backend
```bash
# Chỉ khởi động Backend API Server
start-backend.bat
```

### 🌐 **start-frontend.bat** - Chỉ khởi động Frontend
```bash
# Chỉ khởi động Frontend React App
start-frontend.bat
```

### 🛑 **stop-all.bat** - Dừng tất cả server
```bash
# Dừng tất cả Backend và Frontend
stop-all.bat
```

## 🎯 Cách Sử Dụng Nhanh

### 1. **Khởi động lần đầu:**
```bash
# Double-click hoặc chạy:
start-all.bat
```

### 2. **Truy cập hệ thống:**
- **🌐 React App:** http://localhost:5173
- **🔗 Simple Login:** http://localhost:5173/simple-login  
- **📊 Dashboard:** http://localhost:5173/simple-dashboard
- **🔧 Backend API:** http://localhost:4001/api
- **📚 API Docs:** http://localhost:4001/api/docs

### 3. **Đăng nhập:**
- **Admin:** `admin` / `admin123`
- **Nhân viên:** `NV001` / `123456789012` (CCCD)

## ✍️ Tính Năng Ký Xác Nhận

### 🎯 **Đã được thêm vào dashboard:**
1. Đăng nhập với tài khoản nhân viên
2. Xem thông tin lương trong bảng
3. Click nút **"📝 Ký xác nhận"** dưới bảng
4. Nhập họ tên trong modal
5. Click **"✍️ Xác nhận ký"**
6. Xem trạng thái đã ký với thời gian

### 🔧 **Cách hoạt động:**
- Tự động thêm nút ký vào trang dashboard
- Modal xác nhận với thông tin lương
- Validation nhập họ tên
- Cập nhật trạng thái sau khi ký
- Demo mode hoạt động mượt mà

## 🔧 Cấu Hình Tự Động

### **Backend (.env):**
```env
# Tự động copy từ .env.example
DB_HOST=localhost
DB_PORT=3306
DB_NAME=quan_ly_luong
DB_USER=root
DB_PASSWORD=
PORT=4001
```

### **Frontend (.env):**
```env
# Tự động tạo
VITE_API_BASE_URL=http://localhost:4001/api
```

## 🚨 Xử Lý Lỗi

### **Lỗi Port đã sử dụng:**
```bash
# Chạy stop-all.bat trước
stop-all.bat
# Sau đó khởi động lại
start-all.bat
```

### **Lỗi Node.js không tìm thấy:**
1. Cài đặt Node.js từ https://nodejs.org
2. Restart Command Prompt
3. Chạy lại start-all.bat

### **Lỗi Dependencies:**
```bash
# Xóa node_modules và cài lại
rmdir /s backend\node_modules
rmdir /s frontend\node_modules
start-all.bat
```

## 📋 Thông Tin Hệ Thống

### **Backend:**
- **Port:** 4001
- **Database:** MySQL
- **API:** REST API với JWT
- **Docs:** Swagger UI

### **Frontend:**
- **Port:** 5173
- **Framework:** React + Vite
- **UI:** Tailwind CSS
- **State:** Zustand

### **Tính năng chính:**
- ✅ Đăng nhập Admin/Nhân viên
- ✅ Quản lý thông tin lương
- ✅ **Ký xác nhận nhận lương**
- ✅ Import Excel
- ✅ API Documentation

## 💡 Tips

1. **Luôn chạy Backend trước Frontend**
2. **Sử dụng start-all.bat cho tiện lợi**
3. **Kiểm tra port 4001 và 5173 trống**
4. **Tính năng ký đã được tích hợp sẵn**
5. **Demo mode hoạt động không cần database**
