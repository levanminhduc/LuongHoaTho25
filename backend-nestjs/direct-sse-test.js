// Direct test for SSE broadcast without PayrollService
const axios = require('axios');

async function directSSETest() {
  console.log('🧪 Direct SSE Broadcast Test');

  try {
    // Login as admin to get token
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await axios.post(
      'http://localhost:4002/api/auth/login',
      {
        username: 'admin',
        password: 'admin123',
      },
    );

    const adminToken = loginResponse.data.access_token;
    console.log('✅ Admin token obtained');

    // Send test SSE event directly
    console.log('2️⃣ Sending test SSE event...');
    const testResponse = await axios.post(
      'http://localhost:4002/api/sse/test',
      {
        message: 'Direct SSE Test from Script',
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('✅ Test SSE event sent!');
    console.log('📊 Response:', testResponse.data);

    console.log(
      '\n🎯 Now check the browser admin dashboard for this test event.',
    );
    console.log('   If you see the test event but not payroll_signed events,');
    console.log(
      '   then the issue is specifically in PayrollService SSE integration.',
    );
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

directSSETest();
