const mysql = require('mysql2/promise');

async function addMaNvColumn() {
  let connection;
  try {
    console.log('🔧 Adding ma_nv column to nhan_vien table...');

    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'MayHoaThoDB@12345!',
      database: 'quan_ly_luong',
    });

    console.log('✅ Connected to database successfully!');

    // Add ma_nv column as primary key
    await connection.execute(`
      ALTER TABLE nhan_vien 
      ADD COLUMN ma_nv VARCHAR(10) NOT NULL FIRST,
      ADD PRIMARY KEY (ma_nv)
    `);

    console.log('✅ Added ma_nv column as primary key');

    // Insert some sample data if table is empty
    const [rows] = await connection.execute(
      'SELECT COUNT(*) as count FROM nhan_vien',
    );
    if (rows[0].count === 0) {
      console.log('📝 Inserting sample employee data...');

      await connection.execute(`
        INSERT INTO nhan_vien (ma_nv, ho_ten, cccd, chuc_vu, phong_ban, luong_co_ban, he_so_luong, so_ngay_cong, phu_cap, thuong, khau_tru, luong_thuc_linh)
        VALUES 
        ('admin', 'Quản trị viên', '123456789012', 'Quản lý', 'IT', 20000000, 1.0, 22, 5000000, 0, 2500000, 22500000),
        ('NV001', 'Nguyễn Văn An', '123456789013', 'Nhân viên', 'Kế toán', 15000000, 1.0, 22, 3000000, 0, 1800000, 16200000),
        ('NV002', 'Trần Thị Bình', '123456789014', 'Nhân viên', 'Nhân sự', 12000000, 1.0, 22, 2500000, 0, 1450000, 13050000),
        ('NV003', 'Lê Văn Cường', '123456789015', 'Trưởng phòng', 'Kinh doanh', 18000000, 1.2, 22, 3500000, 0, 2150000, 19350000)
      `);

      console.log('✅ Inserted sample employee data');
    }

    // Show final structure
    console.log('\n🔍 Final table structure:');
    const [columns] = await connection.execute('DESCRIBE nhan_vien');
    columns.forEach((col) => {
      console.log(
        `  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `[${col.Key}]` : ''}`,
      );
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️ Column ma_nv already exists');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

addMaNvColumn();
