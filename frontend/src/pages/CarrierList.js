import React, { useState, useEffect } from 'react';
import { carrierAPI } from '../services/api';
import './CarrierList.css';

function CarrierList() {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cid: '',
    cname: '',
    cmail: '',
    contact: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchCarriers();
  }, []);

  const fetchCarriers = async () => {
    try {
      setLoading(true);
      const response = await carrierAPI.getAll();
      setCarriers(response.data.data || []);
    } catch (err) {
      setError('Failed to load carriers');
      console.error('Error fetching carriers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCarrier = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.cid || !formData.cname || !formData.cmail || !formData.contact) {
      setFormError('All fields are required');
      return;
    }

    try {
      const carrierPayload = {
        cid: parseInt(formData.cid),
        cname: formData.cname,
        cmail: formData.cmail,
        contact: parseInt(formData.contact)
      };

      await carrierAPI.create(carrierPayload);
      setFormSuccess('Carrier added successfully!');
      setFormData({
        cid: '',
        cname: '',
        cmail: '',
        contact: ''
      });
      setShowForm(false);
      fetchCarriers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add carrier');
      console.error('Error adding carrier:', err);
    }
  };

  if (loading) return <div className="loading">Loading carriers...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="carrier-list">
      <div className="carrier-header">
        <h2>Carriers Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Close' : '+ Add New Carrier'}
        </button>
      </div>

      {showForm && (
        <div className="add-carrier-form-container">
          <h3>Add New Carrier</h3>
          {formError && <div className="alert alert-danger">{formError}</div>}
          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
          
          <form onSubmit={handleAddCarrier} className="add-carrier-form">
            <div className="form-group">
              <label>Carrier ID: *</label>
              <input
                type="number"
                name="cid"
                value={formData.cid}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                required
              />
            </div>

            <div className="form-group">
              <label>Carrier Name: *</label>
              <input
                type="text"
                name="cname"
                value={formData.cname}
                onChange={handleInputChange}
                placeholder="e.g., ABC Logistics"
                required
              />
            </div>

            <div className="form-group">
              <label>Email: *</label>
              <input
                type="email"
                name="cmail"
                value={formData.cmail}
                onChange={handleInputChange}
                placeholder="e.g., contact@abclogistics.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number: *</label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="e.g., 9876543210"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">Add Carrier</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="carrier-table-container">
        {carriers.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Carrier ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carriers.map((carrier) => (
                <tr key={carrier.cid}>
                  <td>#{carrier.cid}</td>
                  <td>{carrier.cname || 'N/A'}</td>
                  <td>{carrier.cmail || 'N/A'}</td>
                  <td>{carrier.contact || 'N/A'}</td>
                  <td>
                    <button className="btn btn-sm btn-primary">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-carriers">No carriers found. Click "Add New Carrier" to create one.</p>
        )}
      </div>
    </div>
  );
}

export default CarrierList;
