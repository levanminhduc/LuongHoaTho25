const jwt = require('jsonwebtoken');

// Generate admin token for testing
function generateAdminToken() {
  console.log("🔑 Generating admin token for SSE testing...");
  
  const payload = {
    username: 'admin',
    role: 'admin',
    fullName: 'Administrator'
  };
  
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const token = jwt.sign(payload, secret, { expiresIn: '24h' });
  
  console.log("✅ Admin token generated:");
  console.log(token);
  console.log("\n📋 Copy this token and use it for SSE testing");
  console.log("\n🧪 Test SSE URL:");
  console.log(`http://localhost:4002/api/sse/connect?token=${encodeURIComponent(token)}`);
  
  return token;
}

generateAdminToken();
