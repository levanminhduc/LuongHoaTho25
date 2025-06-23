# 🚀 KHỞI ĐỘNG NHANH - HỆ THỐNG QUẢN LÝ LƯƠNG

## ⚡ KHỞI ĐỘNG 1 LỆNH

### Windows:
```bash
.\start.bat
```

### Linux/Mac:
```bash
chmod +x start.sh && ./start.sh
```

## 🎯 KHỞI ĐỘNG RIÊNG BIỆT

### Chỉ Backend:
```bash
# Windows
.\start-backend.bat

# Linux/Mac
cd backend && npm run dev
```

### Chỉ Frontend:
```bash
# Windows
.\start-frontend.bat

# Linux/Mac
cd frontend && npm run dev
```

## 🌐 TRUY CẬP HỆ THỐNG

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000/api
- **API Docs:** http://localhost:4000/api/docs

## 👤 ĐĂNG NHẬP

```
Admin: admin / admin123
Nhân viên: NV001-NV005 / (mật khẩu = mã NV)
```

## 📚 TÀI LIỆU CHI TIẾT

Xem file `KHOI_DONG_HE_THONG.md` để biết thêm chi tiết về:
- Yêu cầu hệ thống
- Cách khởi động với Docker
- Xử lý lỗi thường gặp
- Cấu hình nâng cao

---

**💡 Mẹo:** Nếu gặp lỗi, hãy kiểm tra:
1. Node.js đã cài đặt chưa (`node --version`)
2. MySQL có đang chạy không
3. Port 4000 và 5173 có bị chiếm không
