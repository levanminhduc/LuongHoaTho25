const { pool } = require("../config/database");

async function checkData() {
  try {
    console.log("🔍 Kiểm tra dữ liệu...");

    // Kiểm tra số nhân viên
    const [employeeRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM nhan_vien"
    );
    console.log("👥 Số nhân viên:", employeeRows[0].count);

    // Kiểm tra một vài nhân viên
    const [employees] = await pool.execute(
      "SELECT ma_nv, ho_ten FROM nhan_vien LIMIT 5"
    );
    console.log("📋 Danh sách nhân viên mẫu:");
    employees.forEach((emp) => {
      console.log(`   - ${emp.ma_nv}: ${emp.ho_ten}`);
    });

    // Kiểm tra số bản ghi lương
    const [salaryRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM luong_import"
    );
    console.log("💰 Số bản ghi lương:", salaryRows[0].count);

    console.log("✅ Kiểm tra hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    process.exit(1);
  }
}

checkData();
