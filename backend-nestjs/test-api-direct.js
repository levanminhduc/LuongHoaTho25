const axios = require('axios');

async function testAPIDirect() {
  console.log('🧪 Testing API endpoints directly...');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:4002/');
    console.log('✅ Health check:', healthResponse.data);

    // Test 2: Test unauthorized payroll request
    console.log('2️⃣ Testing unauthorized payroll request...');
    try {
      await axios.get('http://localhost:4002/api/payroll');
    } catch (error) {
      console.log(
        '✅ Expected 401 error:',
        error.response?.status,
        error.response?.data,
      );
    }

    // Test 3: Login and get real token
    console.log('3️⃣ Getting real token...');
    const loginResponse = await axios.post(
      'http://localhost:4002/api/auth/login',
      {
        username: 'NV001',
        password: '123456789012',
      },
    );

    const token = loginResponse.data.access_token;
    console.log('✅ Got token');

    // Test 4: Authorized payroll request
    console.log('4️⃣ Testing authorized payroll request...');
    const payrollResponse = await axios.get(
      'http://localhost:4002/api/payroll/NV001',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('✅ Payroll data:', payrollResponse.data.message);

    console.log(
      '\n🎯 NestJS API is working! The issue must be in logging/SSE integration.',
    );
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testAPIDirect();
