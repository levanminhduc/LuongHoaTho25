const { pool } = require('./src/config/database');

async function fixDatabaseSchema() {
  try {
    console.log('🔧 Fixing database schema...');

    // Drop existing table if it has wrong structure
    await pool.execute('DROP TABLE IF EXISTS luong_import');
    console.log('🗑️  Dropped existing table');

    // Create table with correct structure
    await pool.execute(`
      CREATE TABLE luong_import (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        ma_nv VARCHAR(20) NOT NULL,
        ho_ten VARCHAR(100),
        luong_cb DECIMAL(15,2) DEFAULT 0,
        phu_cap DECIMAL(15,2) DEFAULT 0,
        thue DECIMAL(15,2) DEFAULT 0,
        thuc_linh DECIMAL(15,2) DEFAULT 0,
        da_ky TINYINT DEFAULT 0,
        ngay_ky DATETIME,
        ten_da_ky VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ma_nv (ma_nv),
        INDEX idx_ho_ten (ho_ten),
        INDEX idx_da_ky (da_ky)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Created table with correct structure');

    // Add test data
    const testData = [
      {
        ma_nv: 'admin',
        ho_ten: 'Quản trị viên',
        luong_cb: 20000000,
        phu_cap: 5000000,
        thue: 2500000,
        thuc_linh: 22500000,
        da_ky: 1,
        ngay_ky: new Date(),
        ten_da_ky: 'Quản trị viên'
      },
      {
        ma_nv: 'NV001',
        ho_ten: 'Nguyễn Văn An',
        luong_cb: 15000000,
        phu_cap: 3000000,
        thue: 1800000,
        thuc_linh: 16200000,
        da_ky: 0,
        ngay_ky: null,
        ten_da_ky: null
      },
      {
        ma_nv: 'NV002',
        ho_ten: 'Trần Thị Bình',
        luong_cb: 12000000,
        phu_cap: 2500000,
        thue: 1450000,
        thuc_linh: 13050000,
        da_ky: 0,
        ngay_ky: null,
        ten_da_ky: null
      },
      {
        ma_nv: 'NV003',
        ho_ten: 'Lê Văn Cường',
        luong_cb: 18000000,
        phu_cap: 3500000,
        thue: 2150000,
        thuc_linh: 19350000,
        da_ky: 1,
        ngay_ky: new Date('2025-06-15'),
        ten_da_ky: 'Lê Văn Cường'
      }
    ];

    // Insert test data
    for (const record of testData) {
      try {
        await pool.execute(`
          INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh, da_ky, ngay_ky, ten_da_ky)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          record.ma_nv,
          record.ho_ten,
          record.luong_cb,
          record.phu_cap,
          record.thue,
          record.thuc_linh,
          record.da_ky,
          record.ngay_ky,
          record.ten_da_ky
        ]);
        
        console.log(`✅ Added: ${record.ma_nv} - ${record.ho_ten}`);
      } catch (error) {
        console.log(`❌ Error adding ${record.ma_nv}: ${error.message}`);
      }
    }

    // Verify data
    const [rows] = await pool.execute('SELECT * FROM luong_import');
    console.log(`🎉 Successfully created table and added ${rows.length} records!`);
    
    // Show sample record
    if (rows.length > 0) {
      console.log('📋 Sample record fields:', Object.keys(rows[0]));
      console.log('📋 Sample record:', rows[0]);
    }

    // Show table structure
    const [structure] = await pool.execute('DESCRIBE luong_import');
    console.log('📊 Table structure:');
    structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });

  } catch (error) {
    console.error('❌ Error fixing database schema:', error.message);
    throw error;
  } finally {
    console.log('🔌 Database schema fix completed');
  }
}

// Run the fix
fixDatabaseSchema().catch(console.error);
