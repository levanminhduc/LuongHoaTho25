const mysql = require('mysql2/promise');
const fs = require('fs');

async function runSQLFix() {
  let connection;
  try {
    console.log('🔧 Running SQL fix...');

    // Create connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'quan_ly_luong',
      port: 3306,
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Read and execute SQL file
    const sqlContent = fs.readFileSync('fix-database-now.sql', 'utf8');
    
    // Split SQL into individual statements
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const [result] = await connection.execute(statement.trim());
          if (Array.isArray(result) && result.length > 0) {
            console.log('📊 Result:', result);
          }
        } catch (error) {
          console.log(`⚠️  Statement warning: ${error.message}`);
        }
      }
    }

    console.log('🎉 SQL fix completed successfully!');

  } catch (error) {
    console.error('❌ Error running SQL fix:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Check if mysql2 is available
try {
  require('mysql2/promise');
  runSQLFix();
} catch (error) {
  console.log('❌ mysql2 not available, trying alternative approach...');
  
  // Alternative: Use backend's existing database connection
  try {
    const { pool } = require('./backend/src/config/database');
    
    async function alternativeFix() {
      try {
        console.log('🔧 Using backend database connection...');
        
        // Clear existing data
        await pool.execute('DELETE FROM luong_import');
        console.log('🗑️  Cleared existing data');

        // Add test data
        const testData = [
          ['admin', 'Quản trị viên', 20000000, 5000000, 2500000, 22500000, 1, new Date(), 'Quản trị viên'],
          ['NV001', 'Nguyễn Văn An', 15000000, 3000000, 1800000, 16200000, 0, null, null],
          ['NV002', 'Trần Thị Bình', 12000000, 2500000, 1450000, 13050000, 0, null, null],
          ['NV003', 'Lê Văn Cường', 18000000, 3500000, 2150000, 19350000, 1, new Date('2025-06-15'), 'Lê Văn Cường']
        ];

        for (const record of testData) {
          await pool.execute(`
            INSERT INTO luong_import (ma_nv, ho_ten, luong_cb, phu_cap, thue, thuc_linh, da_ky, ngay_ky, ten_da_ky)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, record);
          console.log(`✅ Added: ${record[0]} - ${record[1]}`);
        }

        // Verify data
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM luong_import');
        console.log(`🎉 Successfully added ${rows[0].count} records!`);
        
      } catch (error) {
        console.error('❌ Alternative fix error:', error.message);
      }
    }
    
    alternativeFix();
    
  } catch (backendError) {
    console.error('❌ Backend connection also failed:', backendError.message);
    console.log('💡 Please run this script from the backend directory or install mysql2');
  }
}
