const mysql = require('mysql2/promise');

async function checkPayrollData() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'MayHoaThoDB@12345!',
      database: 'quan_ly_luong',
    });

    console.log('📊 Checking payroll data:');
    const [rows] = await connection.execute(`
      SELECT ma_nv, ho_ten, ngay_ky, ten_da_ky, da_ky 
      FROM luong_import 
      ORDER BY ma_nv
    `);

    rows.forEach((row) => {
      const status = row.ngay_ky && row.ten_da_ky ? '✅ Đã ký' : '⏳ Chưa ký';
      console.log(`  - ${row.ma_nv} (${row.ho_ten}): ${status}`);
      if (row.ngay_ky) {
        console.log(
          `    Ký ngày: ${new Date(row.ngay_ky).toLocaleDateString()}, Người ký: ${row.ten_da_ky}`,
        );
      }
    });

    // Make NV002 unsigned for testing
    console.log('\n🔄 Making NV002 unsigned for testing...');
    await connection.execute(`
      UPDATE luong_import 
      SET ngay_ky = NULL, ten_da_ky = NULL, da_ky = 0
      WHERE ma_nv = 'NV002'
    `);

    console.log('✅ NV002 is now unsigned and ready for testing');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkPayrollData();
