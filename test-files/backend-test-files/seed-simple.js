const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  let connection;
  try {
    console.log('🌱 Bắt đầu seed dữ liệu...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'quan_ly_luong',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Kết nối database thành công!');

    // Sample payroll data
    const payrollData = [
      {
        ma_nv: 'NV001',
        ho_ten: 'Nguyễn Văn An',
        luong_cb: 15000000.00,
        phu_cap: 2000000.00,
        thue: 1500000.00,
        thuc_linh: 15500000.00
      },
      {
        ma_nv: 'NV002',
        ho_ten: 'Trần Thị Bình',
        luong_cb: 12000000.00,
        phu_cap: 1500000.00,
        thue: 1200000.00,
        thuc_linh: 12300000.00
      },
      {
        ma_nv: 'NV003',
        ho_ten: 'Lê Văn Cường',
        luong_cb: 18000000.00,
        phu_cap: 2500000.00,
        thue: 2000000.00,
        thuc_linh: 18500000.00
      },
      {
        ma_nv: 'NV004',
        ho_ten: 'Phạm Thị Dung',
        luong_cb: 14000000.00,
        phu_cap: 1800000.00,
        thue: 1400000.00,
        thuc_linh: 14400000.00
      },
      {
        ma_nv: 'NV005',
        ho_ten: 'Hoàng Văn Em',
        luong_cb: 16000000.00,
        phu_cap: 2200000.00,
        thue: 1600000.00,
        thuc_linh: 16600000.00
      }
    ];

    // Clear existing data
    await connection.execute('DELETE FROM luong_import');
    console.log('🗑️  Đã xóa dữ liệu cũ');

    // Insert new data
    for (const payroll of payrollData) {
      await connection.execute(
        'INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh) VALUES (?, ?, ?, ?, ?, ?)',
        [payroll.ma_nv, payroll.ho_ten, payroll.luong_cb, payroll.phu_cap, payroll.thue, payroll.thuc_linh]
      );
      console.log(`✅ Đã thêm: ${payroll.ma_nv} - ${payroll.ho_ten}`);
    }

    console.log(`🎉 Seed dữ liệu thành công! Đã thêm ${payrollData.length} bản ghi.`);

  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Đã đóng kết nối database');
    }
  }
};

// Run seed
seedData().then(() => {
  console.log('✨ Hoàn thành!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Lỗi:', error);
  process.exit(1);
});
