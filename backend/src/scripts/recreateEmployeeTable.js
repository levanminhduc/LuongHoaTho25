const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const recreateEmployeeTable = async () => {
  let connection;
  try {
    console.log("🔧 Recreate bảng nhân viên...");

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "quan_ly_luong",
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ Kết nối database thành công!");

    // Drop foreign key constraint first
    try {
      await connection.execute(
        "ALTER TABLE luong_import DROP FOREIGN KEY fk_luong_nv"
      );
      console.log("🗑️  Đã xóa foreign key constraint");
    } catch (error) {
      console.log("ℹ️  Foreign key constraint không tồn tại hoặc đã bị xóa");
    }

    // Drop existing table
    await connection.execute("DROP TABLE IF EXISTS nhan_vien");
    console.log("🗑️  Đã xóa bảng nhan_vien cũ");

    // Create nhan_vien table with correct schema
    const createTableSQL = `
      CREATE TABLE nhan_vien (
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
    console.log("✅ Tạo bảng nhan_vien mới thành công!");

    // Add foreign key constraint back
    try {
      const addFKSQL = `
        ALTER TABLE luong_import
        ADD CONSTRAINT fk_luong_nv
        FOREIGN KEY (ma_nv)
        REFERENCES nhan_vien(ma_nv)
        ON UPDATE CASCADE
        ON DELETE RESTRICT;
      `;
      await connection.execute(addFKSQL);
      console.log("✅ Đã thêm lại foreign key constraint");
    } catch (error) {
      console.log("⚠️  Lỗi thêm foreign key constraint:", error.message);
    }

    console.log("🎉 Hoàn thành recreate bảng nhân viên!");
  } catch (error) {
    console.error("❌ Lỗi recreate bảng nhân viên:", error.message);
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
  recreateEmployeeTable()
    .then(() => {
      console.log("✨ Hoàn thành!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Lỗi:", error);
      process.exit(1);
    });
}

module.exports = recreateEmployeeTable;
