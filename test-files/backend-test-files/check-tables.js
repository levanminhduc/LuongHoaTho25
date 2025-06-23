const mysql = require('mysql2/promise');

async function checkTables() {
  let connection;
  try {
    console.log('🔍 Checking database tables...');

    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'MayHoaThoDB@12345!',
      database: 'quan_ly_luong',
    });

    console.log('✅ Connected to database successfully!');

    // Show all tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📋 Tables in database:');
    tables.forEach((table) => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // Check specific table structures
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      if (tableName.includes('nhan_vien') || tableName.includes('employee')) {
        console.log(`\n🔍 Structure of ${tableName}:`);
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        columns.forEach((col) => {
          console.log(
            `  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'}`,
          );
        });
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

checkTables();
