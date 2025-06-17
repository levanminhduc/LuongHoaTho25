const { pool } = require('./src/config/database');

async function quickAddData() {
  try {
    console.log('🔧 Quick adding test data...');

    // Clear existing data
    await pool.execute('DELETE FROM luong_import');
    console.log('🗑️  Cleared existing data');

    // Test data
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
    console.log(`🎉 Successfully added ${rows.length} records!`);
    
    // Show sample record
    if (rows.length > 0) {
      console.log('📋 Sample record fields:', Object.keys(rows[0]));
      console.log('📋 Sample record:', rows[0]);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

quickAddData();
