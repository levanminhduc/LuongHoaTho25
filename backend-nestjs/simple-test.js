const axios = require('axios');

async function simpleTest() {
  try {
    console.log('Testing auth login...');
    const response = await axios.post('http://localhost:4002/api/auth/login', {
      username: 'admin',
      password: 'admin123',
    });
    console.log('✅ API working! Response:', response.data.user.username);
  } catch (error) {
    console.log('❌ API failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

simpleTest();
