const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files

// Cấu hình mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MayHoaThoDB@12345!", // <-- Đổi thành password MySQL của anh
  database: "quan_ly_luong",
  port: 3306,
});

// Test kết nối MySQL
connection.connect((err) => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
    console.error("Chi tiết lỗi:", err);
    process.exit(1);
  } else {
    console.log("✅ Kết nối MySQL thành công!");
  }
});

// Cấu hình multer upload file
const upload = multer({ dest: "uploads/" });

// Route cho trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API upload file excel
app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  const workbook = XLSX.readFile(filePath);
  const sheet_name = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name]);

  // Lặp qua từng dòng excel insert vào MySQL
  data.forEach((row) => {
    const { ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh } = row;

    connection.query(
      "INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh) VALUES (?, ?, ?, ?, ?, ?)",
      [ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh],
      (err) => {
        if (err) console.error(err);
      }
    );
  });

  // Xoá file sau khi đọc xong cho sạch
  fs.unlinkSync(filePath);

  res.send("Import file excel thành công!");
});

// ✅ API lấy danh sách bảng lương
app.get("/luong", (req, res) => {
  console.log("📋 Đang lấy danh sách bảng lương...");

  connection.query("SELECT * FROM luong_import", (err, results) => {
    if (err) {
      console.error("❌ Lỗi khi truy vấn database:", err.message);
      console.error("Chi tiết lỗi:", err);

      // Kiểm tra lỗi cụ thể
      if (err.code === "ER_NO_SUCH_TABLE") {
        res.status(500).json({
          error: "Bảng luong_import không tồn tại",
          message: "Vui lòng tạo bảng trước khi sử dụng API",
        });
      } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
        res.status(500).json({
          error: "Lỗi quyền truy cập database",
          message: "Kiểm tra lại thông tin kết nối MySQL",
        });
      } else {
        res.status(500).json({
          error: "Lỗi database",
          message: err.message,
        });
      }
    } else {
      console.log(`✅ Lấy được ${results.length} bản ghi`);
      res.json({
        success: true,
        count: results.length,
        data: results,
      });
    }
  });
});

// ✅ API lấy thông tin lương theo mã nhân viên (cho Công Nhân)
app.get("/luong/:ma_nv", (req, res) => {
  const { ma_nv } = req.params;
  console.log(`📋 Công nhân ${ma_nv} đang tra cứu lương...`);

  connection.query(
    "SELECT * FROM luong_import WHERE ma_nv = ?",
    [ma_nv],
    (err, results) => {
      if (err) {
        console.error("❌ Lỗi khi truy vấn database:", err.message);
        res.status(500).json({
          error: "Lỗi database",
          message: err.message,
        });
      } else if (results.length === 0) {
        console.log(`⚠️  Không tìm thấy thông tin lương cho mã NV: ${ma_nv}`);
        res.status(404).json({
          error: "Không tìm thấy",
          message: `Không tìm thấy thông tin lương cho mã nhân viên: ${ma_nv}`,
        });
      } else {
        console.log(`✅ Tìm thấy thông tin lương cho NV: ${ma_nv}`);
        res.json({
          success: true,
          data: results[0],
        });
      }
    }
  );
});

// ✅ API ký tên xác nhận (cho Công Nhân)
app.post("/luong/:ma_nv/ky-ten", (req, res) => {
  const { ma_nv } = req.params;
  const { ho_ten } = req.body;

  console.log(`✍️  Công nhân ${ma_nv} đang ký tên xác nhận...`);

  // Cập nhật trạng thái đã ký
  connection.query(
    "UPDATE luong_import SET da_ky = 1, ngay_ky = NOW(), ten_da_ky = ? WHERE ma_nv = ?",
    [ho_ten, ma_nv],
    (err, result) => {
      if (err) {
        console.error("❌ Lỗi khi cập nhật ký tên:", err.message);
        res.status(500).json({
          error: "Lỗi database",
          message: err.message,
        });
      } else if (result.affectedRows === 0) {
        res.status(404).json({
          error: "Không tìm thấy",
          message: `Không tìm thấy thông tin lương cho mã nhân viên: ${ma_nv}`,
        });
      } else {
        console.log(`✅ Công nhân ${ma_nv} đã ký tên thành công`);
        res.json({
          success: true,
          message: "Ký tên xác nhận thành công",
          data: {
            ma_nv,
            ho_ten,
            ngay_ky: new Date(),
          },
        });
      }
    }
  );
});

// ✅ API đăng nhập đơn giản
app.post("/login", (req, res) => {
  const { username, password, role } = req.body;

  console.log(`🔐 Đăng nhập: ${username} - Role: ${role}`);

  // Đăng nhập đơn giản (trong thực tế nên dùng JWT và hash password)
  if (role === "admin" && username === "admin" && password === "admin123") {
    res.json({
      success: true,
      message: "Đăng nhập Admin thành công",
      user: {
        username: "admin",
        role: "admin",
        fullName: "Quản trị viên",
      },
    });
  } else if (role === "employee") {
    // Kiểm tra mã nhân viên có tồn tại không
    connection.query(
      "SELECT * FROM luong_import WHERE ma_nv = ?",
      [username],
      (err, results) => {
        if (err) {
          res.status(500).json({
            error: "Lỗi database",
            message: err.message,
          });
        } else if (results.length === 0) {
          res.status(401).json({
            error: "Đăng nhập thất bại",
            message: "Mã nhân viên không tồn tại",
          });
        } else {
          res.json({
            success: true,
            message: "Đăng nhập Công nhân thành công",
            user: {
              username: results[0].ma_nv,
              role: "employee",
              fullName: results[0].ho_ten,
            },
          });
        }
      }
    );
  } else {
    res.status(401).json({
      error: "Đăng nhập thất bại",
      message: "Thông tin đăng nhập không chính xác",
    });
  }
});

// Chạy server
app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
