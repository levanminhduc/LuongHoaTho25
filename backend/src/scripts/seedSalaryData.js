const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'quan_ly_luong',
  charset: 'utf8mb4'
};

async function seedSalaryData() {
  let connection;
  
  try {
    console.log('🌱 Bắt đầu seed dữ liệu lương...');
    
    // Kết nối database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Kết nối database thành công!');
    
    // Xóa dữ liệu cũ
    await connection.execute('DELETE FROM luong_import');
    console.log('🗑️  Đã xóa dữ liệu lương cũ');
    
    // Dữ liệu lương mẫu
    const salaryData = [
      {
        ma_nv: 'NV001',
        ho_ten: 'Nguyễn Văn An',
        luong_cb: 15000000,
        phu_cap: 3000000,
        thue: 1800000,
        thuc_linh: 16200000
      },
      {
        ma_nv: 'NV002',
        ho_ten: 'Trần Thị Bình',
        luong_cb: 12000000,
        phu_cap: 2500000,
        thue: 1450000,
        thuc_linh: 13050000
      },
      {
        ma_nv: 'NV003',
        ho_ten: 'Lê Văn Cường',
        luong_cb: 18000000,
        phu_cap: 3500000,
        thue: 2150000,
        thuc_linh: 19350000
      },
      {
        ma_nv: 'NV004',
        ho_ten: 'Phạm Thị Dung',
        luong_cb: 14000000,
        phu_cap: 2800000,
        thue: 1680000,
        thuc_linh: 15120000
      },
      {
        ma_nv: 'NV005',
        ho_ten: 'Hoàng Văn Em',
        luong_cb: 16000000,
        phu_cap: 3200000,
        thue: 1920000,
        thuc_linh: 17280000
      }
    ];
    
    // Thêm dữ liệu
    for (const salary of salaryData) {
      try {
        await connection.execute(`
          INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh, ngay_ky)
          VALUES (?, ?, ?, ?, ?, ?, NOW())
        `, [
          salary.ma_nv,
          salary.ho_ten,
          salary.luong_cb,
          salary.phu_cap,
          salary.thue,
          salary.thuc_linh
        ]);
        
        console.log(`✅ Đã thêm lương: ${salary.ma_nv} - ${salary.ho_ten}`);
      } catch (error) {
        console.log(`❌ Lỗi thêm ${salary.ma_nv}: ${error.message}`);
      }
    }
    
    console.log('🎉 Seed dữ liệu lương thành công!');
    
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu lương:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Đã đóng kết nối database');
    }
  }
}

// Chạy script
if (require.main === module) {
  seedSalaryData()
    .then(() => {
      console.log('✨ Hoàn thành!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Lỗi:', error);
      process.exit(1);
    });
}

module.exports = { seedSalaryData };
