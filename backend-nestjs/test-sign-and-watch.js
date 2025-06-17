const axios = require('axios');

async function testSignAndWatch() {
  console.log('🔄 Starting SSE + Payroll Sign Test...');

  try {
    // 1. Login as NV001
    console.log('1️⃣ Logging in as NV001...');
    const loginResponse = await axios.post(
      'http://localhost:4002/api/auth/login',
      {
        username: 'NV001',
        password: '123456789012',
      },
    );

    const token = loginResponse.data.access_token;
    console.log('✅ Login successful');

    // 2. Sign payroll (this should trigger SSE broadcast)
    console.log('2️⃣ Signing payroll (should trigger SSE broadcast)...');
    const signResponse = await axios.post(
      'http://localhost:4002/api/payroll/NV001/sign',
      { ho_ten: 'Nguyen Van An' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('✅ Payroll signed successfully!');
    console.log('📊 Sign response:', {
      success: signResponse.data.success,
      message: signResponse.data.message,
    });

    console.log('\n🔍 Look for these logs in NestJS backend:');
    console.log('  - "🔧 DEBUG: About to broadcast SSE event for NV001"');
    console.log('  - "📡 DEBUG: SSE event broadcast successful for NV001"');
    console.log('  - "📡 SSE: Event \'payroll_signed\' sent to X admin(s)"');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testSignAndWatch();
