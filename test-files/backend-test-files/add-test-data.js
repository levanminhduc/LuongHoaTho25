const { pool } = require("./src/config/database");

async function addTestData() {
  try {
    console.log("🔧 Adding test data with proper values...");

    // Update existing records with proper salary data
    const testData = [
      {
        ma_nv: '4211',
        luong_co_ban: 15000000,
        phu_cap: 2000000,
        khau_tru: 1700000,
        luong_thuc_linh: 15300000,
        da_ky: 1,
        ngay_ky: new Date(),
        ten_da_ky: 'LÊ VĂN MINH ĐỨC'
      },
      {
        ma_nv: 'admin',
        luong_co_ban: 20000000,
        phu_cap: 5000000,
        khau_tru: 2500000,
        luong_thuc_linh: 22500000,
        da_ky: 0,
        ngay_ky: null,
        ten_da_ky: null
      },
      {
        ma_nv: 'NV002',
        luong_co_ban: 12000000,
        phu_cap: 1500000,
        khau_tru: 1350000,
        luong_thuc_linh: 12150000,
        da_ky: 1,
        ngay_ky: new Date(),
        ten_da_ky: 'Trần Thị Bình'
      }
    ];

    for (const data of testData) {
      try {
        await pool.execute(`
          UPDATE luong_import 
          SET luong_co_ban = ?, phu_cap = ?, khau_tru = ?, luong_thuc_linh = ?, 
              da_ky = ?, ngay_ky = ?, ten_da_ky = ?
          WHERE ma_nv = ?
        `, [
          data.luong_co_ban,
          data.phu_cap,
          data.khau_tru,
          data.luong_thuc_linh,
          data.da_ky,
          data.ngay_ky,
          data.ten_da_ky,
          data.ma_nv
        ]);
        
        console.log(`✅ Updated salary data for: ${data.ma_nv}`);
      } catch (error) {
        console.log(`❌ Error updating ${data.ma_nv}: ${error.message}`);
      }
    }

    // Add some new records if needed
    const newRecords = [
      {
        ma_nv: 'NV001',
        ho_ten: 'Nguyễn Văn An',
        luong_co_ban: 18000000,
        phu_cap: 3000000,
        khau_tru: 2100000,
        luong_thuc_linh: 18900000,
        da_ky: 0
      },
      {
        ma_nv: 'NV003',
        ho_ten: 'Phạm Thị Cường',
        luong_co_ban: 14000000,
        phu_cap: 2200000,
        khau_tru: 1620000,
        luong_thuc_linh: 14580000,
        da_ky: 1,
        ngay_ky: new Date(),
        ten_da_ky: 'Phạm Thị Cường'
      }
    ];

    for (const record of newRecords) {
      try {
        await pool.execute(`
          INSERT INTO luong_import (ma_nv, ho_ten, luong_co_ban, phu_cap, khau_tru, luong_thuc_linh, da_ky, ngay_ky, ten_da_ky)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          luong_co_ban = VALUES(luong_co_ban),
          phu_cap = VALUES(phu_cap),
          khau_tru = VALUES(khau_tru),
          luong_thuc_linh = VALUES(luong_thuc_linh),
          da_ky = VALUES(da_ky),
          ngay_ky = VALUES(ngay_ky),
          ten_da_ky = VALUES(ten_da_ky)
        `, [
          record.ma_nv,
          record.ho_ten,
          record.luong_co_ban,
          record.phu_cap,
          record.khau_tru,
          record.luong_thuc_linh,
          record.da_ky,
          record.ngay_ky || null,
          record.ten_da_ky || null
        ]);
        
        console.log(`✅ Added/Updated record: ${record.ma_nv} - ${record.ho_ten}`);
      } catch (error) {
        console.log(`❌ Error adding ${record.ma_nv}: ${error.message}`);
      }
    }
    
    console.log('🎉 Test data added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding test data:', error.message);
    throw error;
  }
}

addTestData()
  .then(() => {
    console.log('✨ Completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('💥 Error:', error);
    process.exit(1);
  });
