// Test script to verify login and redirect flow
// Run this in browser console on http://localhost:3000/login

async function testLoginFlow() {
  console.log('Testing login flow...');
  
  try {
    // Step 1: Login
    const loginResponse = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'testuser1765706376@test.com',
        password: 'testpass123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok || !loginData.token) {
      console.error('❌ Login failed:', loginData);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('Token:', loginData.token.substring(0, 50) + '...');
    console.log('User Role:', loginData.user.role);
    
    // Step 2: Store token
    localStorage.setItem('token', loginData.token);
    console.log('✅ Token stored in localStorage');
    
    // Step 3: Determine redirect path
    let redirectPath = '/';
    if (loginData.user.role === 'ADMIN') {
      redirectPath = '/admin/dashboard';
    } else if (loginData.user.role === 'SUPPLIER') {
      redirectPath = '/supplier/dashboard';
    } else if (loginData.user.role === 'PHARMACY') {
      redirectPath = '/pharmacy/dashboard';
    } else if (loginData.user.role === 'USER') {
      redirectPath = '/user/dashboard';
    }
    
    console.log('Expected redirect path:', redirectPath);
    
    // Step 4: Navigate to dashboard
    console.log('Navigating to:', redirectPath);
    window.location.href = redirectPath;
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testLoginFlow();


