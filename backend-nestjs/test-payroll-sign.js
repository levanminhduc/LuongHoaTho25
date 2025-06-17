const axios = require('axios');

async function testPayrollSign() {
  try {
    console.log('🔐 Logging in as NV001...');

    // Login to get token
    const loginResponse = await axios.post(
      'http://localhost:4002/api/auth/login',
      {
        username: 'NV001',
        password: '123456789012',
      },
    );

    const token = loginResponse.data.access_token;
    console.log('✅ Login successful, got token');

    console.log('📝 Signing payroll for NV001...');

    // Sign payroll
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
    console.log('📊 Response:', {
      success: signResponse.data.success,
      message: signResponse.data.message,
      ngay_ky: signResponse.data.data.ngay_ky,
      ten_da_ky: signResponse.data.data.ten_da_ky,
    });

    console.log('📡 Check SSE connections to see if event was broadcast...');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testPayrollSign();
