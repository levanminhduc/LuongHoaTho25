const { pool } = require("../config/database");

async function createSSEEventsTable() {
  try {
    console.log("🔧 Creating SSE Events table...");
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS sse_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        event_data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_event_type (event_type),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await pool.execute(createTableSQL);
    console.log("✅ SSE Events table created successfully!");

    // Insert a test event
    const testEventSQL = `
      INSERT INTO sse_events (event_type, event_data) VALUES 
      ('system', '{"type": "system", "message": "SSE Events table initialized", "timestamp": "${new Date().toISOString()}"}')
    `;

    await pool.execute(testEventSQL);
    console.log("✅ Test event inserted successfully!");

    // Verify table creation
    const [rows] = await pool.execute("SELECT COUNT(*) as count FROM sse_events");
    console.log(`📊 SSE Events table has ${rows[0].count} records`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating SSE Events table:", error.message);
    process.exit(1);
  }
}

createSSEEventsTable();
