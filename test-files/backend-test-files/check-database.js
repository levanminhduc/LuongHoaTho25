const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  let connection;
  try {
    console.log('🔍 Checking actual database structure...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'MayHoaThoDB@12345!',
      database: process.env.DB_NAME || 'quan_ly_luong',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ Connected to database successfully!');

    // Check table structure
    console.log('\n📋 Checking luong_import table structure:');
    const [columns] = await connection.execute('DESCRIBE luong_import');
    
    console.log('Columns in luong_import table:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Default ? `default: ${col.Default}` : ''}`);
    });

    // Check sample data
    console.log('\n📊 Sample data from luong_import:');
    const [rows] = await connection.execute('SELECT * FROM luong_import LIMIT 3');
    
    if (rows.length > 0) {
      console.log('Sample records:');
      rows.forEach((row, index) => {
        console.log(`Record ${index + 1}:`, row);
      });
    } else {
      console.log('No data found in luong_import table');
    }

    // Check if specific columns exist
    const requiredColumns = ['thue', 'thuc_linh', 'da_ky', 'luong_cb'];
    console.log('\n🔍 Checking required columns:');
    
    requiredColumns.forEach(colName => {
      const exists = columns.find(col => col.Field === colName);
      if (exists) {
        console.log(`✅ ${colName}: EXISTS (${exists.Type})`);
      } else {
        console.log(`❌ ${colName}: NOT FOUND`);
      }
    });

  } catch (error) {
    console.error('❌ Database check error:', error.message);
    console.error('Error details:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

checkDatabase()
  .then(() => {
    console.log('\n✨ Database check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
