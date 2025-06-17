# Hệ Thống Quản Lý Lương

Hệ thống quản lý và tra cứu lương nhân viên được xây dựng với **React.js** (Frontend) và **Node.js/Express** (Backend).

## 🚀 Tính năng chính

### Admin
- ✅ Đăng nhập với quyền quản trị viên
- ✅ Import dữ liệu bảng lương từ file Excel
- ✅ Xem danh sách bảng lương với phân trang và tìm kiếm
- ✅ Theo dõi trạng thái ký nhận lương của nhân viên

### Nhân viên
- ✅ Đăng nhập bằng mã nhân viên
- ✅ Xem thông tin lương cá nhân
- ✅ Ký nhận lương điện tử

## 🛠 Công nghệ sử dụng

### Frontend
- **React 18** với TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router DOM** - Routing
- **Zustand** - State management
- **React Query** - Data fetching
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js 20** với Express
- **MySQL 8** - Database
- **JWT** - Authentication
- **Multer** - File upload
- **XLSX** - Excel processing
- **Joi** - Validation
- **Swagger** - API documentation

### DevOps
- **Docker** & **Docker Compose**
- **GitHub Actions** - CI/CD
- **ESLint** & **Prettier** - Code quality

## 📁 Cấu trúc dự án

```
payroll-system/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database & auth config
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Auth, validation, error handling
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities & helpers
│   │   └── index.js        # App entry point
│   ├── tests/              # Unit tests
│   └── Dockerfile
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   └── Dockerfile
├── database/               # Database scripts
├── .github/workflows/      # CI/CD pipelines
└── docker-compose.yml      # Development setup
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js 20+
- MySQL 8+
- Docker & Docker Compose (tùy chọn)

### 1. Clone repository
```bash
git clone <repository-url>
cd payroll-system
```

### 2. Cài đặt với Docker (Khuyến nghị)
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up --build

# Seed sample data (optional)
docker-compose exec backend npm run seed
```

### 3. Cài đặt thủ công

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Cập nhật thông tin database trong .env
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

#### Database
```bash
# Import database schema
mysql -u root -p < database/init.sql
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **API Documentation**: http://localhost:4000/api/docs
- **phpMyAdmin**: http://localhost:8080 (chỉ khi dùng Docker)

## 👤 Thông tin đăng nhập demo

### Admin
- **Username**: admin
- **Password**: admin123

### Nhân viên
- **Mã NV**: NV001, NV002, NV003, NV004, NV005
- **Password**: Sử dụng chính mã nhân viên làm mật khẩu

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/profile` - Lấy thông tin profile

### Payroll
- `GET /api/payroll` - Lấy danh sách bảng lương (Admin)
- `GET /api/payroll/:ma_nv` - Lấy thông tin lương theo mã NV
- `POST /api/payroll/:ma_nv/sign` - Ký nhận lương
- `POST /api/payroll/upload` - Import Excel (Admin)

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm run lint
npm run type-check
```

## 📦 Build Production

### Docker
```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Manual
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 🚀 Deploy

### Render.com
1. Tạo Web Service cho backend
2. Tạo Static Site cho frontend
3. Thêm MySQL add-on hoặc external database
4. Cấu hình environment variables

### Railway.app
1. Deploy từ GitHub repository
2. Cấu hình environment variables
3. Thêm MySQL database service

## 🔧 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quan_ly_luong
DB_PORT=3306
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME=Payroll Management System
VITE_APP_VERSION=1.0.0
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên GitHub repository.

---

**Phát triển bởi**: [Tên của bạn]  
**Email**: [email@example.com]  
**Version**: 1.0.0
