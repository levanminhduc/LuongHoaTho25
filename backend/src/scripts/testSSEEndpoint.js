const jwt = require('jsonwebtoken');

async function testSSEEndpoint() {
  console.log("🧪 Testing SSE Endpoint...");
  
  try {
    // Create a test admin token
    const testToken = jwt.sign(
      { 
        username: 'admin', 
        role: 'admin',
        fullName: 'Test Admin'
      }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log("🔑 Generated test token:", testToken.substring(0, 50) + "...");
    
    // Test SSE stats endpoint
    console.log("\n📊 Testing SSE stats endpoint...");
    const statsResponse = await fetch('http://localhost:4001/api/sse/stats', {
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    });
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log("✅ SSE stats:", stats);
    } else {
      console.error("❌ SSE stats failed:", statsResponse.status, await statsResponse.text());
    }
    
    // Test SSE test endpoint
    console.log("\n🧪 Testing SSE test endpoint...");
    const testResponse = await fetch('http://localhost:4001/api/sse/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      },
      body: JSON.stringify({
        message: 'Test SSE event from script'
      })
    });
    
    if (testResponse.ok) {
      const result = await testResponse.json();
      console.log("✅ SSE test event sent:", result);
    } else {
      console.error("❌ SSE test failed:", testResponse.status, await testResponse.text());
    }
    
    // Test SSE history endpoint
    console.log("\n📚 Testing SSE history endpoint...");
    const historyResponse = await fetch('http://localhost:4001/api/sse/history', {
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    });
    
    if (historyResponse.ok) {
      const history = await historyResponse.json();
      console.log("✅ SSE history:", history);
    } else {
      console.error("❌ SSE history failed:", historyResponse.status, await historyResponse.text());
    }
    
    console.log("\n✅ SSE Endpoint test completed!");
    
  } catch (error) {
    console.error("❌ SSE Endpoint test failed:", error.message);
  }
}

// Test if we can import fetch
if (typeof fetch === 'undefined') {
  console.log("Installing node-fetch...");
  global.fetch = require('node-fetch');
}

testSSEEndpoint();
