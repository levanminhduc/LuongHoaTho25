Bạn hãy tạo (generate) một dự án “Xem Tiền Lương” hoàn chỉnh, bao gồm **Frontend React.js** và **Backend Node.js/Express** theo các yêu cầu chi tiết bên dưới. 

### 0. Giả định đầu vào cần biết
- Tôi đã có sẵn file backend NodeJS tên `app.js` (đã refactor: JWT, connection pool, import Excel, ký lương…) đặt tại repo gốc. **Không ghi đè file này** – chỉ tích hợp, tách thành modules theo kiến trúc bên dưới.
- Sẽ dùng MySQL (đã có schema `luong_import`, `nhan_vien`).
- Sẽ chạy local trước, sau đó deploy (tạm) trên Render.com hoặc Railway.app (free tier).

### 1. Công nghệ & phiên bản
- **Frontend**: React ^18, Vite, TypeScript, React-Router-DOM ^6, Axios, Zustand (hoặc React-Query) cho state/data fetching, TailwindCSS ^3 (kèm postcss, autoprefixer), Eslint + Prettier.
- **Backend**: Node ^20, Express ^4, mysql2/promise, jsonwebtoken, bcryptjs, multer, Joi, dotenv, helmet, cors, express-rate-limit.
- **Dev tools**: husky + lint-staged (pre-commit), eslint-config-airbnb-typescript, prettier.
- **CI**: GitHub Actions (node + docker build test).
- **Docker**: `Dockerfile` & `docker-compose.yml` để bật `node`, `mysql`, `phpmyadmin` local.

### 2. Cấu trúc thư mục (monorepo)
root/
├─ backend/
│ ├─ src/
│ │ ├─ app.js (file gốc của tôi, move vào đây & export)
│ │ ├─ routes/
│ │ │ ├─ auth.routes.js
│ │ │ ├─ payroll.routes.js
│ │ ├─ controllers/
│ │ ├─ services/
│ │ ├─ middlewares/
│ │ ├─ models/
│ │ ├─ utils/
│ │ └─ index.js (khởi tạo Express, import routes, error handler)
│ ├─ tests/ (jest + supertest mẫu)
│ ├─ .env.example
│ └─ Dockerfile
├─ frontend/
│ ├─ src/
│ │ ├─ assets/
│ │ ├─ components/ (Button, Input, Table, Modal…)
│ │ ├─ pages/
│ │ │ ├─ Login.tsx
│ │ │ ├─ Dashboard/
│ │ │ └─ PayrollDetail.tsx
│ │ ├─ routes/
│ │ ├─ hooks/
│ │ ├─ services/ (axios instance, authService, payrollService)
│ │ ├─ store/ (zustand)
│ │ ├─ layouts/
│ │ ├─ utils/
│ │ ├─ App.tsx
│ │ └─ main.tsx
│ ├─ public/
│ ├─ index.html
│ ├─ tailwind.config.cjs
│ ├─ vite.config.ts
│ ├─ .env.example
│ └─ Dockerfile
├─ docker-compose.yml
├─ .github/workflows/ci.yml
└─ README.md

markdown
Sao chép
Chỉnh sửa

### 3. Backend – bổ sung
1. **Tách modules**: di chuyển logic của `app.js` gốc vào `controllers`, `routes`, `services`, nhưng giữ nguyên chức năng.
2. **Config**: `config/db.js` (pool), `config/auth.js` (JWT secret & expiry).
3. **Auth Middleware**: kiểm tra `Bearer` token, truyền `req.user`.
4. **Validation**: Joi schemas cho tất cả body & params.
5. **Pagination & Search**: `/luong?keyword=&page=&limit=` (keyword lọc `ma_nv` hoặc `ho_ten` LIKE).
6. **Upload limit**: 10 MB; lưu file tạm rồi xoá.
7. **Rate limit**: 200 req / 15 phút / IP.
8. **Swagger**: `/docs` auto-generated (swagger-jsdoc + swagger-ui-express).

### 4. Frontend – yêu cầu UI/UX
1. **Layout** Responsive (Tailwind, Flexbox/Grid):
   - Header (logo, tên người dùng, logout).
   - Sidebar (đối với admin): link Import, Danh sách lương.
2. **State**:
   - `authStore` giữ `token`, `role`, `user`.
   - Axios interceptor gắn `Authorization`.
3. **Trang Login**:
   - Chọn role (admin / công nhân) → nhập mã NV + pass.
4. **Trang Admin**:
   - Table bảng lương: server-side pagination, search.
   - Form import Excel: kéo thả, progress bar.
5. **Trang Công nhân**:
   - Xem bảng lương của mình (card chi tiết).
   - Nút “Ký nhận lương” → gọi `/ky-ten`, update realtime.
6. **UX mượt**:
   - Loading spinner (react-spinners).
   - Toaster (sonner hoặc react-hot-toast).
   - Debounce search 300 ms.
   - Suspense & Code-splitting (lazy components).
7. **Eslint + Prettier** strict; 100 % TypeScript.

### 5. Scripts
- **Backend**  
  `npm run dev` – nodemon;  
  `npm run test` – jest.  

- **Frontend**  
  `npm run dev` – vite;  
  `npm run build` – vite build;  
  `npm run preview` – vite preview.

### 6. Docker & Deploy
- `docker-compose up -d` spin `mysql:8`, `phpmyadmin`, `backend`, `frontend`.
- Build multi-stage Dockerfile để xuất image nhỏ.  
- Demo deploy on Render:
  1. Create two services (web-service for backend, static-site for frontend)  
  2. Set env vars from `.env.example`.  
  3. Add MySQL add-on or external ClearDB.

### 7. README
Hướng dẫn:
- clone, copy `.env.example` ➜ `.env`, sửa secrets  
- `docker-compose up --build`  
- Truy cập: `http://localhost:5173` (FE) & `http://localhost:4000/api` (BE)  
- Swagger docs: `/api/docs`

### 8. Bàn giao
* Xuất dự án thành **zip hoặc repo Git**.  
* Đảm bảo chạy `npm run test` pass.  
* Cung cấp seed SQL và script `npm run seed` (nếu cần).  
* Kèm video/gif demo UI và Postman collection.

**Hãy tạo mã nguồn đầy đủ và chính xác, tuân thủ cấu trúc trên.**