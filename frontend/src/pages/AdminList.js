import React, { useState, useEffect } from 'react';
import '../styles/AdminList.css';
import api from '../services/api';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', mail: '', password: '', role: 'ADMIN' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.adminAPI.getAll();
      setAdmins(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch admins');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.adminAPI.create(formData);
      setFormData({ name: '', mail: '', password: '', role: 'ADMIN' });
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      setError('Failed to add admin');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await api.adminAPI.delete(id);
        fetchAdmins();
      } catch (err) {
        setError('Failed to delete admin');
      }
    }
  };

  if (loading) return <div className="loading">Loading admins...</div>;

  return (
    <div className="admin-list-container">
      <h1>Admin Management</h1>
      
      <button className="btn-add" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Add New Admin'}
      </button>

      {showForm && (
        <form className="admin-form" onSubmit={handleAddAdmin}>
          <input
            type="text"
            placeholder="Admin Name"
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
          <button type="submit" className="btn-submit">Add Admin</button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}

      {admins.length === 0 ? (
        <div className="no-data">No admins found</div>
      ) : (
        <table className="admins-table">
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
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.name}</td>
                <td>{admin.mail}</td>
                <td>{admin.role}</td>
                <td>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteAdmin(admin.id)}
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

export default AdminList;
