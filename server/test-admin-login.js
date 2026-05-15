// Test admin login
const API_BASE = 'http://localhost:5000/api';

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login...\n');

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@slotshare.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Admin login successful!');
      console.log('   User:', data.user);
      console.log('   Token:', data.token.substring(0, 50) + '...');
    } else {
      console.log('❌ Admin login failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAdminLogin();