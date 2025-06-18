const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const seedEmployees = async () => {
  let connection;
  try {
    console.log("🌱 Bắt đầu seed dữ liệu nhân viên...");

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "quan_ly_luong",
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ Kết nối database thành công!");

    // Sample employee data
    const employees = [
      { ma_nv: "NV001", ho_ten: "Nguyễn Văn An", cccd: "123456789012" },
      { ma_nv: "NV002", ho_ten: "Trần Thị Bình", cccd: "123456789013" },
      { ma_nv: "NV003", ho_ten: "Lê Văn Cường", cccd: "123456789014" },
      { ma_nv: "NV004", ho_ten: "Phạm Thị Dung", cccd: "123456789015" },
      { ma_nv: "NV005", ho_ten: "Hoàng Văn Em", cccd: "123456789016" },
      { ma_nv: "NV006", ho_ten: "Vũ Thị Hoa", cccd: "123456789017" },
      { ma_nv: "NV007", ho_ten: "Đỗ Văn Giang", cccd: "123456789018" },
      { ma_nv: "NV008", ho_ten: "Bùi Thị Lan", cccd: "123456789019" },
      { ma_nv: "NV009", ho_ten: "Ngô Văn Minh", cccd: "123456789020" },
      { ma_nv: "NV010", ho_ten: "Lý Thị Nga", cccd: "123456789021" },
      { ma_nv: "4211", ho_ten: "Lê Văn Minh Đức", cccd: "123456789999" },
    ];

    // Clear existing data
    await connection.execute("DELETE FROM nhan_vien");
    console.log("🗑️  Đã xóa dữ liệu nhân viên cũ");

    // Insert new employees
    const saltRounds = 10;
    for (const employee of employees) {
      try {
        // Hash CCCD
        const cccdHash = await bcrypt.hash(employee.cccd, saltRounds);

        await connection.execute(
          "INSERT INTO nhan_vien (ma_nv, ho_ten, cccd_hash) VALUES (?, ?, ?)",
          [employee.ma_nv, employee.ho_ten, cccdHash]
        );

        console.log(`✅ Đã thêm: ${employee.ma_nv} - ${employee.ho_ten}`);
      } catch (error) {
        console.error(`❌ Lỗi thêm ${employee.ma_nv}:`, error.message);
      }
    }

    console.log(
      `🎉 Seed dữ liệu nhân viên thành công! Đã thêm ${employees.length} nhân viên.`
    );

    // Display sample login info
    console.log("\n📋 Thông tin đăng nhập mẫu:");
    console.log("Admin: admin/admin123");
    console.log("Nhân viên: NV001/123456789012 (CCCD)");
    console.log("Nhân viên: NV002/123456789013 (CCCD)");
    console.log("Nhân viên: 4211/123456789999 (CCCD)");
    console.log("...");
  } catch (error) {
    console.error("❌ Lỗi seed dữ liệu nhân viên:", error.message);
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
  seedEmployees()
    .then(() => {
      console.log("✨ Hoàn thành!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Lỗi:", error);
      process.exit(1);
    });
}

module.exports = seedEmployees;
