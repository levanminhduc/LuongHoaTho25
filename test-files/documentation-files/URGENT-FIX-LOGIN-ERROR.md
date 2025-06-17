# 🚨 **URGENT: SỬA LỖI LOGIN "KHÔNG THỂ KẾT NỐI SERVER"**

## ❌ **VẤN ĐỀ:**
- Frontend NextJS (port 3000) không thể kết nối đến backend
- Lỗi: "Không thể kết nối server. Vui lòng thử lại."

## 🔍 **NGUYÊN NHÂN:**
- Frontend NextJS đã được cấu hình để gọi NestJS backend (port 4002)
- Nhưng NestJS backend KHÔNG đang chạy
- Chỉ có Express.js backend đang chạy (port 4001)

## ⚡ **GIẢI PHÁP NHANH (2 phút):**

### **Bước 1: Mở Terminal/Command Prompt**
```bash
# Vào thư mục dự án
cd F:\LuongHoaTho_New
```

### **Bước 2: Khởi động NestJS Backend**
```bash
# Mở terminal mới và chạy:
cd backend-nestjs
npm run start:dev
```

**HOẶC** nếu NestJS không khởi động được:

### **Bước 2 (Thay thế): Chuyển về Express.js Backend**

#### **2a. Cập nhật file .env.local trong frontend-nextjs:**
```env
# Thay đổi từ:
NEXT_PUBLIC_API_URL=http://localhost:4002/api

# Thành:
NEXT_PUBLIC_API_URL=http://localhost:4001/api
```

#### **2b. Cập nhật CORS trong backend/.env:**
```env
# Thay đổi từ:
FRONTEND_URL=http://localhost:5173

# Thành:
FRONTEND_URL=http://localhost:3000
```

#### **2c. Restart Express.js Backend:**
```bash
# Dừng Express.js (Ctrl+C trong terminal backend)
# Sau đó khởi động lại:
cd backend
npm run dev
```

### **Bước 3: Test Login**
1. Mở http://localhost:3000/login
2. Đăng nhập với:
   - **Admin:** `admin` / `admin123`
   - **Employee:** `NV001` / `123456789012`

## 🔧 **SCRIPT TỰ ĐỘNG (Khuyến nghị):**

Chạy script này để tự động sửa lỗi:
```bash
./fix-connection-issue.bat
```

## 🧪 **KIỂM TRA KẾT NỐI:**

### **Test Backend:**
```bash
# Test Express.js
curl http://localhost:4001/api/health

# Test NestJS (nếu đang chạy)
curl http://localhost:4002/api/health
```

### **Kiểm tra Ports:**
```bash
netstat -ano | findstr :3000  # NextJS Frontend
netstat -ano | findstr :4001  # Express.js Backend
netstat -ano | findstr :4002  # NestJS Backend
```

## 📊 **TRẠNG THÁI HIỆN TẠI:**

| Service | Port | Status | URL |
|---------|------|--------|-----|
| NextJS Frontend | 3000 | ✅ Running | http://localhost:3000 |
| Express.js Backend | 4001 | ✅ Running | http://localhost:4001 |
| NestJS Backend | 4002 | ❌ Not Running | http://localhost:4002 |

## 🎯 **GIẢI PHÁP DÀI HẠN:**

### **Option 1: Sử dụng NestJS (Mới)**
1. Khởi động NestJS backend
2. Cấu hình frontend gọi port 4002
3. Tận dụng các tính năng mới

### **Option 2: Tiếp tục Express.js (Ổn định)**
1. Giữ cấu hình hiện tại
2. Frontend gọi port 4001
3. Hệ thống hoạt động ổn định

## 🆘 **NẾU VẪN LỖI:**

### **1. Clear Browser Cache:**
- Nhấn `Ctrl + Shift + R` để hard refresh
- Hoặc mở Incognito/Private mode

### **2. Kiểm tra Browser Console:**
- Nhấn `F12` → Console tab
- Xem lỗi chi tiết
- Chụp màn hình gửi để hỗ trợ

### **3. Kiểm tra Network Tab:**
- F12 → Network tab
- Thử login và xem request nào fail
- Kiểm tra URL đang gọi đến

### **4. Restart Toàn Bộ:**
```bash
# Dừng tất cả services (Ctrl+C)
# Sau đó chạy lại:
./start-new-system.bat
```

## 📞 **HỖ TRỢ NHANH:**

Nếu vẫn gặp lỗi, hãy cung cấp:
1. Screenshot lỗi trên browser
2. Console errors (F12)
3. Kết quả của: `netstat -ano | findstr :3000`
4. Kết quả của: `netstat -ano | findstr :4001`

## ✅ **CHECKLIST:**
- [ ] Backend đang chạy (port 4001 hoặc 4002)
- [ ] Frontend đang chạy (port 3000)
- [ ] File .env.local có đúng API URL
- [ ] CORS được cấu hình đúng
- [ ] Browser cache đã được clear
- [ ] Login credentials đúng
