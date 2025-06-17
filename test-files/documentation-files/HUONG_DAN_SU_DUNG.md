# 📖 Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Lương

## 🚀 Khởi Động Hệ Thống

### 1. Khởi động Backend (API Server)
```bash
# Mở Terminal/Command Prompt
cd F:\LuongHoaTho\backend
node src\index.js
```
✅ **Kết quả:** Server chạy tại http://localhost:4001

### 2. Khởi động Frontend (Web Server)
```bash
# Mở Terminal/Command Prompt mới
cd F:\LuongHoaTho
npx serve . -p 5173
```
✅ **Kết quả:** Web server chạy tại http://localhost:5173

## 🌐 Truy Cập Hệ Thống

### Trang Chính
**URL:** http://localhost:5173/index.html

### Trang Demo (Backup)
**URL:** http://localhost:5173/frontend-demo.html

### API Testing
**URL:** http://localhost:5173/test-api.html

## 🔐 Tài Khoản Đăng Nhập

### 👨‍💼 Quản Trị Viên (Admin)
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** `Quản trị viên`
- **Quyền:** Xem tất cả dữ liệu lương của nhân viên

### 👤 Nhân Viên (Employee)
- **Username:** `NV001`, `NV002`, `NV003`, ..., `NV010`
- **Password:** `123456`
- **Role:** `Nhân viên`
- **Quyền:** Chỉ xem lương của chính mình

## 📊 Dữ Liệu Có Sẵn

Hệ thống có sẵn dữ liệu của 10 nhân viên:

| Mã NV | Họ Tên | Lương CB | Phụ Cấp | Thuế | Thực Lĩnh |
|-------|--------|----------|----------|------|-----------|
| NV001 | Nguyễn Văn An | 15,000,000 | 2,000,000 | 1,500,000 | 15,500,000 |
| NV002 | Trần Thị Bình | 12,000,000 | 1,500,000 | 1,200,000 | 12,300,000 |
| NV003 | Lê Văn Cường | 18,000,000 | 2,500,000 | 2,000,000 | 18,500,000 |
| NV004 | Phạm Thị Dung | 14,000,000 | 1,800,000 | 1,400,000 | 14,400,000 |
| NV005 | Hoàng Văn Em | 16,000,000 | 2,200,000 | 1,600,000 | 16,600,000 |
| NV006 | Vũ Thị Hoa | 13,000,000 | 1,700,000 | 1,300,000 | 13,400,000 |
| NV007 | Đỗ Văn Giang | 17,000,000 | 2,300,000 | 1,700,000 | 17,600,000 |
| NV008 | Bùi Thị Lan | 11,000,000 | 1,400,000 | 1,100,000 | 11,300,000 |
| NV009 | Ngô Văn Minh | 19,000,000 | 2,600,000 | 2,100,000 | 19,500,000 |
| NV010 | Lý Thị Nga | 15,500,000 | 2,100,000 | 1,550,000 | 16,050,000 |

## 🎯 Cách Sử Dụng

### Bước 1: Truy cập trang đăng nhập
1. Mở trình duyệt
2. Truy cập: http://localhost:5173/index.html
3. Bạn sẽ thấy form đăng nhập

### Bước 2: Đăng nhập
1. **Nhập thông tin:**
   - Tên đăng nhập: `admin` hoặc `NV001`
   - Mật khẩu: `admin123` hoặc `123456`
   - Vai trò: Chọn `Quản trị viên` hoặc `Nhân viên`

2. **Nhấn nút "Đăng Nhập"**

### Bước 3: Xem dữ liệu lương
- **Admin:** Thấy bảng lương của tất cả nhân viên
- **Nhân viên:** Chỉ thấy lương của chính mình

### Bước 4: Ký nhận lương (Nhân viên)
1. **Xem thông tin lương chi tiết**
2. **Kiểm tra trạng thái ký:**
   - ✅ **Đã ký:** Hiển thị thông tin người ký và thời gian
   - ⏳ **Chưa ký:** Hiển thị nút "Ký xác nhận nhận lương"
3. **Thực hiện ký:**
   - Nhấn nút "Ký xác nhận nhận lương"
   - Nhập chính xác họ tên trong popup
   - Nhấn "Xác nhận ký"
4. **Lưu ý quan trọng:**
   - Kiểm tra kỹ thông tin lương trước khi ký
   - Sau khi ký sẽ không thể thay đổi
   - Thời gian ký được ghi lại tự động

### Bước 5: Quản lý ký nhận (Admin)
1. **Xem thống kê:** Dashboard hiển thị tổng quan tình hình ký
2. **Theo dõi chi tiết:** Xem danh sách ai đã ký, ai chưa ký
3. **Lịch sử ký:** Xem thời gian và người ký của từng nhân viên

### Bước 6: Đăng xuất
- Nhấn nút "Đăng Xuất" ở góc phải trên

## 🔧 Tính Năng

### ✅ Đã Hoàn Thành
- 🔐 Đăng nhập với phân quyền
- 📊 Hiển thị dữ liệu lương theo role
- 💰 Format tiền tệ VND
- 📱 Giao diện responsive
- 🔄 Tải lại dữ liệu
- ⚡ Loading states
- ❌ Error handling
- 🛡️ Bảo mật API với JWT
- ✍️ **Ký xác nhận lương** (Mới!)
  - Nhân viên có thể ký xác nhận đã nhận lương
  - Ghi lại thời gian và người ký
  - Không thể thay đổi sau khi ký
- 📈 **Thống kê ký nhận** (Mới!)
  - Admin xem tổng quan tình hình ký
  - Theo dõi tiến độ ký nhận
  - Lịch sử ký chi tiết

### 🚧 Có Thể Mở Rộng
- 📤 Import Excel
- 📥 Export PDF/Excel báo cáo ký
- 🔍 Tìm kiếm nâng cao
- 📄 Phân trang tối ưu
- 📧 Thông báo email khi ký
- 🔔 Nhắc nhở nhân viên chưa ký

## 🐛 Xử Lý Lỗi

### Lỗi Kết Nối
- **Triệu chứng:** "Lỗi kết nối server"
- **Giải pháp:** Kiểm tra backend có chạy không (port 4001)

### Lỗi Đăng Nhập
- **Triệu chứng:** "Thông tin đăng nhập không chính xác"
- **Giải pháp:** Kiểm tra username/password và role

### Lỗi Database
- **Triệu chứng:** "Không thể tải dữ liệu"
- **Giải pháp:** Kiểm tra MySQL có chạy và password đúng

## 📞 Hỗ Trợ

### Database
- **Host:** localhost
- **User:** root
- **Password:** MayHoaThoDB@12345!
- **Database:** quan_ly_luong
- **Table:** luong_import

### API Endpoints
- **Health Check:** GET /api/health
- **Login:** POST /api/auth/login
- **Get All Payroll:** GET /api/payroll (Admin only)
- **Get Employee Payroll:** GET /api/payroll/:ma_nv
- **Sign Payroll:** POST /api/payroll/:ma_nv/sign (Ký xác nhận lương)

### Ports
- **Backend API:** 4001
- **Frontend Web:** 5173
- **MySQL:** 3306

## 🎉 Chúc Bạn Sử Dụng Thành Công!

Hệ thống đã sẵn sàng để sử dụng. Nếu có vấn đề gì, hãy kiểm tra lại các bước khởi động và đảm bảo tất cả services đang chạy.
