import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CustomerList.css';
import api from '../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', mail: '', password: '', role: 'CUSTOMER' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.customerAPI.getAll();
      setCustomers(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.customerAPI.create(formData);
      setFormData({ name: '', mail: '', password: '', role: 'CUSTOMER' });
      setShowForm(false);
      fetchCustomers();
    } catch (err) {
      setError('Failed to add customer');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.customerAPI.delete(id);
        fetchCustomers();
      } catch (err) {
        setError('Failed to delete customer');
      }
    }
  };

  if (loading) return <div className="loading">Loading customers...</div>;

  return (
    <div className="customer-list-container">
      <h1>Customer Management</h1>
      
      <button className="btn-add" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Add New Customer'}
      </button>

      {showForm && (
        <form className="customer-form" onSubmit={handleAddCustomer}>
          <input
            type="text"
            placeholder="Customer Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.mail}
            onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" className="btn-submit">Add Customer</button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}

      {customers.length === 0 ? (
        <div className="no-data">No customers found</div>
      ) : (
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.mail}</td>
                <td>{customer.role}</td>
                <td>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteCustomer(customer.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerList;
