// Debug file to check environment variables
console.log('=== Environment Debug ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
console.log('REACT_APP_API_TIMEOUT:', process.env.REACT_APP_API_TIMEOUT);

// Test the API connection
const testConnection = async () => {
  try {
    console.log('Testing connection to:', process.env.REACT_APP_API_BASE_URL);
    const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mail: 'admin123@gamil.com',
        password: 'Admin@123',
        userType: 'ADMIN'
      })
    });
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
  } catch (error) {
    console.error('Connection error:', error);
  }
};

testConnection();
