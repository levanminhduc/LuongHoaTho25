# 🚀 HƯỚNG DẪN KHỞI ĐỘNG HỆ THỐNG QUẢN LÝ LƯƠNG

## 📋 MỤC LỤC
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cách khởi động nhanh](#cách-khởi-động-nhanh)
3. [Cách khởi động thủ công](#cách-khởi-động-thủ-công)
4. [Cách khởi động với Docker](#cách-khởi-động-với-docker)
5. [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)
6. [Thông tin truy cập](#thông-tin-truy-cập)

---

## 🔧 YÊU CẦU HỆ THỐNG

### Bắt buộc:
- **Node.js** >= 16.0.0 ([Tải tại đây](https://nodejs.org))
- **npm** >= 8.0.0 (đi kèm với Node.js)
- **MySQL** >= 8.0 (hoặc sử dụng Docker)

### Tùy chọn:
- **Docker Desktop** (để chạy với container)
- **Git** (để clone dự án)

---

## ⚡ CÁCH KHỞI ĐỘNG NHANH

### 🎯 Cách đơn giản nhất:

**Windows:**
```bash
# Khởi động cả hệ thống
.\start.bat

# Hoặc khởi động riêng từng service
.\start-backend.bat    # Chỉ Backend
.\start-frontend.bat   # Chỉ Frontend
```

**Linux/Mac:**
```bash
# Cấp quyền thực thi (chỉ cần làm 1 lần)
chmod +x start.sh

# Khởi động hệ thống
./start.sh
```

**Các script sẽ tự động:**
- ✅ Kiểm tra Node.js và npm
- ✅ Tạo file cấu hình (.env)
- ✅ Cài đặt dependencies
- ✅ Khởi động Backend và/hoặc Frontend
- ✅ Hiển thị thông tin truy cập

---

## 🔧 KHỞI ĐỘNG RIÊNG TỪNG SERVICE

### Backend Only:
```bash
# Windows
.\start-backend.bat

# Linux/Mac
cd backend && npm run dev
```

### Frontend Only:
```bash
# Windows
.\start-frontend.bat

# Linux/Mac
cd frontend && npm run dev
```

### Ưu điểm khởi động riêng:
- 🎯 **Tập trung phát triển** một phần cụ thể
- 🐛 **Debug dễ dàng** hơn
- 💾 **Tiết kiệm tài nguyên** hệ thống
- 🔄 **Restart nhanh** khi cần thiết

---

## 🛠️ CÁCH KHỞI ĐỘNG THỦ CÔNG

### Bước 1: Chuẩn bị môi trường
```bash
# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version
```

### Bước 2: Tạo file cấu hình
```bash
# Tạo file .env cho backend
copy backend\.env.example backend\.env
```

### Bước 3: Cài đặt dependencies

**Backend:**
```bash
cd backend
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### Bước 4: Khởi động services

**Terminal 1 - Backend:**
```bash
cd backend
node src/index.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npx vite
```

**Hoặc sử dụng npm scripts:**
```bash
# Backend
cd backend
npm run dev

# Frontend  
cd frontend
npm run dev
```

---

## 🐳 CÁCH KHỞI ĐỘNG VỚI DOCKER

### Yêu cầu:
- Docker Desktop đã cài đặt và chạy

### Lệnh khởi động:
```bash
# Khởi động tất cả services
docker-compose up --build

# Chạy ở chế độ nền
docker-compose up -d --build

# Dừng services
docker-compose down
```

### Services trong Docker:
- **MySQL Database** - Port 3306
- **phpMyAdmin** - Port 8080
- **Backend API** - Port 4000
- **Frontend** - Port 5173

---

## 🔧 XỬ LÝ LỖI THƯỜNG GẶP

### ❌ Lỗi: "Port already in use"
```bash
# Kiểm tra process đang sử dụng port
netstat -ano | findstr :4000
netstat -ano | findstr :5173

# Kill process theo PID
taskkill /PID <PID_NUMBER> /F
```

### ❌ Lỗi: "Module not found"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### ❌ Lỗi: "Cannot connect to database"
1. Kiểm tra MySQL đang chạy
2. Kiểm tra thông tin kết nối trong file `.env`
3. Tạo database `quan_ly_luong` nếu chưa có

### ❌ Lỗi: "Permission denied"
```bash
# Chạy với quyền admin (Windows)
# Click phải Command Prompt -> "Run as administrator"
```

---

## 🌐 THÔNG TIN TRUY CẬP

### URLs chính:
- **🖥️ Frontend:** http://localhost:5173
- **🔧 Backend API:** http://localhost:4000/api
- **📚 API Documentation:** http://localhost:4000/api/docs
- **🗄️ phpMyAdmin:** http://localhost:8080 (chỉ khi dùng Docker)

### Tài khoản mặc định:
```
👨‍💼 Admin:
   Username: admin
   Password: admin123

👥 Nhân viên mẫu:
   Username: NV001, NV002, NV003, NV004, NV005
   Password: (giống username)
```

---

## 📝 GHI CHÚ QUAN TRỌNG

### ⚠️ Lưu ý khi sử dụng:
1. **Không đóng terminal** khi hệ thống đang chạy
2. **Dừng hệ thống:** Nhấn `Ctrl + C` trong các terminal
3. **Thay đổi port:** Sửa file `.env` trong thư mục backend
4. **Database:** Cần có MySQL chạy trước khi khởi động backend

### 🔄 Khởi động lại hệ thống:
```bash
# Dừng tất cả terminal đang chạy (Ctrl + C)
# Sau đó chạy lại
.\start.bat
```

### 📊 Kiểm tra trạng thái:
- Backend: Truy cập http://localhost:4000/api/health
- Frontend: Truy cập http://localhost:5173

---

## 🆘 HỖ TRỢ

Nếu gặp vấn đề, hãy kiểm tra:
1. **Log trong terminal** để xem lỗi cụ thể
2. **File .env** có đúng cấu hình không
3. **MySQL** có đang chạy không
4. **Port** có bị xung đột không

**Liên hệ hỗ trợ:** [Thông tin liên hệ của bạn]
