const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const createEmployeeTable = async () => {
  let connection;
  try {
    console.log("🔧 Tạo bảng nhân viên...");

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "quan_ly_luong",
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ Kết nối database thành công!");

    // Create nhan_vien table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS nhan_vien (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ma_nv VARCHAR(20) NOT NULL UNIQUE,
        ho_ten VARCHAR(255) NOT NULL,
        cccd_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ma_nv (ma_nv)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableSQL);
    console.log("✅ Tạo bảng nhan_vien thành công!");

    // Check if foreign key exists
    const [fkCheck] = await connection.execute(
      `
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'luong_import' 
      AND CONSTRAINT_NAME = 'fk_luong_nv'
    `,
      [process.env.DB_NAME || "quan_ly_luong"]
    );

    if (fkCheck.length === 0) {
      // Add foreign key constraint
      const addFKSQL = `
        ALTER TABLE luong_import
        ADD CONSTRAINT fk_luong_nv
        FOREIGN KEY (ma_nv)
        REFERENCES nhan_vien(ma_nv)
        ON UPDATE CASCADE
        ON DELETE RESTRICT;
      `;

      await connection.execute(addFKSQL);
      console.log("✅ Thêm foreign key constraint thành công!");
    } else {
      console.log("ℹ️  Foreign key constraint đã tồn tại");
    }

    console.log("🎉 Hoàn thành tạo bảng nhân viên!");
  } catch (error) {
    console.error("❌ Lỗi tạo bảng nhân viên:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Đã đóng kết nối database");
    }
  }
};

// Run if called directly
if (require.main === module) {
  createEmployeeTable()
    .then(() => {
      console.log("✨ Hoàn thành!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Lỗi:", error);
      process.exit(1);
    });
}

module.exports = createEmployeeTable;
