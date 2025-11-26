import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { customerAPI } from '../services/api';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Full name must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.mail.trim()) {
      newErrors.mail = 'Email is required';
    } else if (!emailRegex.test(formData.mail)) {
      newErrors.mail = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Create customer with role "CUSTOMER"
      const response = await customerAPI.create({
        name: formData.name.trim(),
        mail: formData.mail.trim(),
        password: formData.password,
        role: 'CUSTOMER',
      });

      if (response.data.statuscode === 201 || response.data.statuscode === 200) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage(response.data.message || 'Failed to create account');
      }
    } catch (err) {
      // Check if error is due to duplicate email
      if (err.response?.data?.message?.includes('already')) {
        setErrorMessage('Email already registered. Please use a different email or login.');
      } else {
        setErrorMessage(err.response?.data?.message || 'Failed to create account. Please try again.');
      }
      console.error('Error registering customer:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Customer Account</h2>
        <p className="register-subtitle">Join Ekart Cargo Management System</p>

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mail">Email Address</label>
            <input
              type="email"
              id="mail"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.mail ? 'input-error' : ''}
            />
            {errors.mail && <span className="error-message">{errors.mail}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min 6 characters)"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-register" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>

        {/* <div className="register-benefits">
          <h4>Why Register?</h4>
          <ul>
            <li>📦 Place and track your orders</li>
            <li>📊 View order history</li>
            <li>🚚 Monitor cargo shipments</li>
            <li>⭐ Manage your account</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}

export default Register;
