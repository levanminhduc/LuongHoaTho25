const { pool } = require("../config/database");

const seedData = async () => {
  try {
    console.log("🌱 Bắt đầu seed dữ liệu...");

    // Sample payroll data - matching your database structure
    const payrollData = [
      {
        ma_nv: "NV001",
        ho_ten: "Nguyễn Văn An",
        luong_cb: 15000000.0,
        phu_cap: 2000000.0,
        thue: 1500000.0,
        thuc_linh: 15500000.0,
      },
      {
        ma_nv: "NV002",
        ho_ten: "Trần Thị Bình",
        luong_cb: 12000000.0,
        phu_cap: 1500000.0,
        thue: 1200000.0,
        thuc_linh: 12300000.0,
      },
      {
        ma_nv: "NV003",
        ho_ten: "Lê Văn Cường",
        luong_cb: 18000000.0,
        phu_cap: 2500000.0,
        thue: 2000000.0,
        thuc_linh: 18500000.0,
      },
      {
        ma_nv: "NV004",
        ho_ten: "Phạm Thị Dung",
        luong_cb: 14000000.0,
        phu_cap: 1800000.0,
        thue: 1400000.0,
        thuc_linh: 14400000.0,
      },
      {
        ma_nv: "NV005",
        ho_ten: "Hoàng Văn Em",
        luong_cb: 16000000.0,
        phu_cap: 2200000.0,
        thue: 1600000.0,
        thuc_linh: 16600000.0,
      },
      {
        ma_nv: "NV006",
        ho_ten: "Vũ Thị Hoa",
        luong_cb: 13000000.0,
        phu_cap: 1700000.0,
        thue: 1300000.0,
        thuc_linh: 13400000.0,
      },
      {
        ma_nv: "NV007",
        ho_ten: "Đỗ Văn Giang",
        luong_cb: 17000000.0,
        phu_cap: 2300000.0,
        thue: 1700000.0,
        thuc_linh: 17600000.0,
      },
      {
        ma_nv: "NV008",
        ho_ten: "Bùi Thị Lan",
        luong_cb: 11000000.0,
        phu_cap: 1400000.0,
        thue: 1100000.0,
        thuc_linh: 11300000.0,
      },
      {
        ma_nv: "NV009",
        ho_ten: "Ngô Văn Minh",
        luong_cb: 19000000.0,
        phu_cap: 2600000.0,
        thue: 2100000.0,
        thuc_linh: 19500000.0,
      },
      {
        ma_nv: "NV010",
        ho_ten: "Lý Thị Nga",
        luong_cb: 15500000.0,
        phu_cap: 2100000.0,
        thue: 1550000.0,
        thuc_linh: 16050000.0,
      },
    ];

    // Insert payroll data
    for (const payroll of payrollData) {
      await pool.execute(
        `INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh) 
         VALUES (?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
         ho_ten = VALUES(ho_ten),
         luong_cb = VALUES(luong_cb),
         phu_cap = VALUES(phu_cap),
         thue = VALUES(thue),
         thuc_linh = VALUES(thuc_linh)`,
        [
          payroll.ma_nv,
          payroll.ho_ten,
          payroll.luong_cb,
          payroll.phu_cap,
          payroll.thue,
          payroll.thuc_linh,
        ]
      );
    }

    // Sample employee data
    const employeeData = [
      {
        ma_nv: "NV001",
        ho_ten: "Nguyễn Văn An",
        email: "an.nguyen@company.com",
        so_dien_thoai: "0901234567",
        chuc_vu: "Nhân viên",
        phong_ban: "Kế toán",
        ngay_vao_lam: "2023-01-15",
      },
      {
        ma_nv: "NV002",
        ho_ten: "Trần Thị Bình",
        email: "binh.tran@company.com",
        so_dien_thoai: "0901234568",
        chuc_vu: "Nhân viên",
        phong_ban: "Nhân sự",
        ngay_vao_lam: "2023-02-20",
      },
      {
        ma_nv: "NV003",
        ho_ten: "Lê Văn Cường",
        email: "cuong.le@company.com",
        so_dien_thoai: "0901234569",
        chuc_vu: "Trưởng phòng",
        phong_ban: "Kỹ thuật",
        ngay_vao_lam: "2022-12-01",
      },
      {
        ma_nv: "NV004",
        ho_ten: "Phạm Thị Dung",
        email: "dung.pham@company.com",
        so_dien_thoai: "0901234570",
        chuc_vu: "Nhân viên",
        phong_ban: "Marketing",
        ngay_vao_lam: "2023-03-10",
      },
      {
        ma_nv: "NV005",
        ho_ten: "Hoàng Văn Em",
        email: "em.hoang@company.com",
        so_dien_thoai: "0901234571",
        chuc_vu: "Nhân viên",
        phong_ban: "Kỹ thuật",
        ngay_vao_lam: "2023-01-25",
      },
    ];

    // Insert employee data
    for (const employee of employeeData) {
      await pool.execute(
        `INSERT INTO nhan_vien (ma_nv, ho_ten, email, so_dien_thoai, chuc_vu, phong_ban, ngay_vao_lam) 
         VALUES (?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
         ho_ten = VALUES(ho_ten),
         email = VALUES(email),
         so_dien_thoai = VALUES(so_dien_thoai),
         chuc_vu = VALUES(chuc_vu),
         phong_ban = VALUES(phong_ban),
         ngay_vao_lam = VALUES(ngay_vao_lam)`,
        [
          employee.ma_nv,
          employee.ho_ten,
          employee.email,
          employee.so_dien_thoai,
          employee.chuc_vu,
          employee.phong_ban,
          employee.ngay_vao_lam,
        ]
      );
    }

    console.log("✅ Seed dữ liệu thành công!");
    console.log(`📊 Đã thêm ${payrollData.length} bản ghi bảng lương`);
    console.log(`👥 Đã thêm ${employeeData.length} bản ghi nhân viên`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi seed dữ liệu:", error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
