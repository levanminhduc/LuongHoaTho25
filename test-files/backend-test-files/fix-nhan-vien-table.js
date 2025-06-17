const mysql = require('mysql2/promise');

async function fixNhanVienTable() {
  let connection;
  try {
    console.log('🔧 Fixing nhan_vien table...');

    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'MayHoaThoDB@12345!',
      database: 'quan_ly_luong',
    });

    console.log('✅ Connected to database successfully!');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await connection.execute('DELETE FROM nhan_vien');

    // Check if ma_nv column exists
    const [columns] = await connection.execute('DESCRIBE nhan_vien');
    const hasOldId = columns.some((col) => col.Field === 'id');
    const hasMaNv = columns.some((col) => col.Field === 'ma_nv');

    if (hasOldId && !hasMaNv) {
      console.log('🔄 Dropping old id column and adding ma_nv...');
      await connection.execute('ALTER TABLE nhan_vien DROP PRIMARY KEY');
      await connection.execute('ALTER TABLE nhan_vien DROP COLUMN id');
    }

    if (!hasMaNv) {
      console.log('➕ Adding ma_nv column as primary key...');
      await connection.execute(`
        ALTER TABLE nhan_vien 
        ADD COLUMN ma_nv VARCHAR(10) NOT NULL FIRST,
        ADD PRIMARY KEY (ma_nv)
      `);
    }

    // Insert sample data
    console.log('📝 Inserting sample employee data...');
    await connection.execute(`
      INSERT INTO nhan_vien (ma_nv, ho_ten, cccd, chuc_vu, phong_ban, luong_co_ban, he_so_luong, so_ngay_cong, phu_cap, thuong, khau_tru, luong_thuc_linh)
      VALUES 
      ('admin', 'Quản trị viên', '123456789012', 'Quản lý', 'IT', 20000000.00, 1.0, 22, 5000000.00, 0.00, 2500000.00, 22500000.00),
      ('NV001', 'Nguyễn Văn An', '123456789013', 'Nhân viên', 'Kế toán', 15000000.00, 1.0, 22, 3000000.00, 0.00, 1800000.00, 16200000.00),
      ('NV002', 'Trần Thị Bình', '123456789014', 'Nhân viên', 'Nhân sự', 12000000.00, 1.0, 22, 2500000.00, 0.00, 1450000.00, 13050000.00),
      ('NV003', 'Lê Văn Cường', '123456789015', 'Trưởng phòng', 'Kinh doanh', 18000000.00, 1.2, 22, 3500000.00, 0.00, 2150000.00, 19350000.00)
    `);

    console.log('✅ Inserted sample employee data');

    // Show final structure and data
    console.log('\n🔍 Final table structure:');
    const [finalColumns] = await connection.execute('DESCRIBE nhan_vien');
    finalColumns.forEach((col) => {
      console.log(
        `  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `[${col.Key}]` : ''}`,
      );
    });

    console.log('\n📊 Sample data:');
    const [data] = await connection.execute(
      'SELECT ma_nv, ho_ten, chuc_vu FROM nhan_vien LIMIT 5',
    );
    data.forEach((row) => {
      console.log(`  - ${row.ma_nv}: ${row.ho_ten} (${row.chuc_vu})`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

fixNhanVienTable();
