#!/bin/bash

echo "========================================"
echo "  HỆ THỐNG QUẢN LÝ LƯƠNG - KHỞI ĐỘNG"
echo "========================================"
echo

echo "[1/6] Kiểm tra Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js từ https://nodejs.org"
    exit 1
fi
echo "✅ Node.js đã sẵn sàng ($(node --version))"

echo
echo "[2/6] Kiểm tra npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm chưa được cài đặt."
    exit 1
fi
echo "✅ npm đã sẵn sàng ($(npm --version))"

echo
echo "[3/6] Sao chép file cấu hình..."
if [ ! -f "backend/.env" ]; then
    cp "backend/.env.example" "backend/.env"
    echo "✅ Đã tạo backend/.env"
else
    echo "ℹ️  backend/.env đã tồn tại"
fi

echo
echo "[4/6] Cài đặt dependencies cho Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Đang cài đặt backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Lỗi khi cài đặt backend dependencies"
        exit 1
    fi
    echo "✅ Backend dependencies đã được cài đặt"
else
    echo "ℹ️  Backend dependencies đã tồn tại"
fi
cd ..

echo
echo "[5/6] Cài đặt dependencies cho Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Đang cài đặt frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Lỗi khi cài đặt frontend dependencies"
        exit 1
    fi
    echo "✅ Frontend dependencies đã được cài đặt"
else
    echo "ℹ️  Frontend dependencies đã tồn tại"
fi
cd ..

echo
echo "[6/6] Khởi động hệ thống..."
echo "🚀 Đang khởi động Backend và Frontend..."
echo
echo "⚠️  LƯU Ý: Hệ thống sẽ mở 2 terminal:"
echo "   - Terminal 1: Backend (Node.js)"
echo "   - Terminal 2: Frontend (Vite)"
echo
echo "📝 Nhấn Ctrl+C để dừng hệ thống!"
echo
read -p "Nhấn Enter để tiếp tục..."

echo "Khởi động Backend..."
cd backend
node src/index.js &
BACKEND_PID=$!
cd ..

sleep 3

echo "Khởi động Frontend..."
cd frontend
npx vite &
FRONTEND_PID=$!
cd ..

echo
echo "========================================"
echo "  HỆ THỐNG ĐÃ KHỞI ĐỘNG THÀNH CÔNG!"
echo "========================================"
echo
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:4000/api"
echo "📚 API Docs: http://localhost:4000/api/docs"
echo
echo "👤 Thông tin đăng nhập:"
echo "   Admin: admin / admin123"
echo "   Nhân viên: NV001-NV005 (mật khẩu = mã NV)"
echo
echo "💡 Mẹo: Nhấn Ctrl+C để dừng hệ thống"
echo
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Trap Ctrl+C to kill both processes
trap 'echo "Đang dừng hệ thống..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT

# Wait for processes
wait
