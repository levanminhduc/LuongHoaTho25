const mysql = require('mysql2/promise');

async function resetNV001() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'MayHoaThoDB@12345!',
      database: 'quan_ly_luong',
    });

    await conn.execute(`
      UPDATE luong_import 
      SET ngay_ky = NULL, ten_da_ky = NULL, da_ky = 0 
      WHERE ma_nv = 'NV001'
    `);

    console.log('✅ NV001 is now unsigned and ready for testing');
    await conn.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

resetNV001();
