import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';
import { authAPI } from '../services/api';

const Login = () => {
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({ mail: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!formData.mail || !formData.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      let response;
      console.log('Attempting login:', { userType, email: formData.mail });
      
      if (userType === 'customer') {
        response = await authAPI.customerLogin(formData.mail, formData.password);
      } else {
        response = await authAPI.adminLogin(formData.mail, formData.password);
      }
      
      console.log('Login response:', response.data);
      
      // Check if login was successful (statuscode 200)
      if (response.data && response.data.statuscode === 200 && response.data.data) {
        const userData = response.data.data;
        console.log('Login successful:', userData);
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          name: userData.name,
          mail: userData.mail,
          role: userData.role,
          userType: userData.userType
        }));
        
        // Trigger storage event for NavBar update
        window.dispatchEvent(new Event('storage'));
        
        navigate('/dashboard');
      } else {
        // Handle 401 Unauthorized response
        const errorMsg = response.data?.message || 'Invalid email or password';
        console.log('Login failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      // Check if it's a network error or response error
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.message === 'Network Error') {
        setError('Cannot connect to server. Please check if backend is running.');
      } else {
        setError('Login failed. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Ekart Login</h1>
        
        <div className="user-type-toggle">
          <button
            className={userType === 'customer' ? 'active' : ''}
            onClick={() => setUserType('customer')}
          >
            Customer Login
          </button>
          <button
            className={userType === 'admin' ? 'active' : ''}
            onClick={() => setUserType('admin')}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.mail}
              onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>New customer? <Link to="/register" className="register-link">Create an account</Link></p>
          {/* <p className="demo-cred">Demo Credentials:</p>
          <p className="demo-cred">Customer: Use any customer email/password from database</p>
          <p className="demo-cred">Admin: Use any admin email/password from database</p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
