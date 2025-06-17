const jwt = require('jsonwebtoken');

// Test SSE connection manually
async function testSSEConnection() {
  console.log("🧪 Testing SSE Connection...");
  
  try {
    // Create admin token
    const token = jwt.sign(
      { 
        username: 'admin', 
        role: 'admin',
        fullName: 'Test Admin'
      }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log("🔑 Generated token for admin");
    
    // Test SSE connection URL
    const sseUrl = `http://localhost:4002/api/sse/connect?token=${encodeURIComponent(token)}`;
    console.log("📡 SSE URL:", sseUrl);
    
    // Test with EventSource (if available in Node.js)
    if (typeof EventSource !== 'undefined') {
      console.log("🔌 Testing EventSource connection...");
      const eventSource = new EventSource(sseUrl);
      
      eventSource.onopen = () => {
        console.log("✅ SSE Connection opened successfully!");
      };
      
      eventSource.onmessage = (event) => {
        console.log("📨 SSE Message received:", event.data);
      };
      
      eventSource.onerror = (error) => {
        console.error("❌ SSE Connection error:", error);
        eventSource.close();
      };
      
      // Close after 5 seconds
      setTimeout(() => {
        console.log("🔌 Closing SSE connection...");
        eventSource.close();
      }, 5000);
      
    } else {
      console.log("⚠️ EventSource not available in Node.js environment");
      console.log("📋 You can test manually by:");
      console.log("1. Open browser console");
      console.log("2. Run: const es = new EventSource('" + sseUrl + "')");
      console.log("3. Run: es.onmessage = (e) => console.log('SSE:', e.data)");
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testSSEConnection();
