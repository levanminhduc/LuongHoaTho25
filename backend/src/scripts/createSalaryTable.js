const { pool } = require("../config/database");

async function createSalaryTable() {
  try {
    console.log("🔧 Tạo bảng luong_import...");

    // Kết nối database
    const connection = await pool.getConnection();
    console.log("✅ Kết nối database thành công!");

    // Tạo bảng luong_import
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS luong_import (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ma_nv VARCHAR(20) NOT NULL,
        ho_ten VARCHAR(100),
        luong_cb DECIMAL(15,2),
        phu_cap DECIMAL(15,2),
        thue DECIMAL(15,2),
        thuc_linh DECIMAL(15,2),
        da_ky TINYINT DEFAULT 0,
        ngay_ky DATETIME,
        ten_da_ky VARCHAR(100)
      ) ENGINE=InnoDB;
    `);

    console.log("✅ Bảng luong_import đã được tạo!");

    // Giải phóng kết nối
    connection.release();
    console.log("🔌 Đã đóng kết nối database");
    console.log("✨ Hoàn thành!");
  } catch (error) {
    console.error("❌ Lỗi tạo bảng luong_import:", error.message);
    throw error;
  }
}

createSalaryTable()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log("💥 Lỗi:", error);
    process.exit(1);
  });
