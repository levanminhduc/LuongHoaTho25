const sseService = require("../services/sseService");

async function testSSE() {
  console.log("🧪 Testing SSE Service...");
  
  try {
    // Test 1: Get stats
    console.log("\n📊 Test 1: Getting SSE stats");
    const stats = sseService.getStats();
    console.log("Stats:", stats);
    
    // Test 2: Emit a test payroll signed event
    console.log("\n✍️ Test 2: Emitting payroll signed event");
    sseService.emitPayrollSigned({
      ma_nv: "TEST001",
      ho_ten: "Nguyễn Test",
      ngay_ky: new Date(),
      ten_da_ky: "Nguyễn Test"
    });
    
    // Test 3: Get event history from database
    console.log("\n📚 Test 3: Getting event history from database");
    const history = await sseService.getEventHistoryFromDB(10);
    console.log(`Found ${history.length} events in database`);
    history.forEach((event, index) => {
      console.log(`${index + 1}. ${event.event_type} - ${event.created_at}`);
    });
    
    console.log("\n✅ SSE Service test completed successfully!");
    
  } catch (error) {
    console.error("❌ SSE Service test failed:", error.message);
  }
  
  process.exit(0);
}

testSSE();
