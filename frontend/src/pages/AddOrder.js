import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, addressAPI } from '../services/api';
import './AddOrder.css';

function AddOrder() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    cargoname: '',
    cargodescription: '',
    cargoweight: '',
    cargocount: '',
    addressid: '',
    unaddressid: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
    
    // Fetch addresses for loading and unloading dropdowns
    const fetchAddresses = async () => {
      try {
        console.log('Fetching addresses...');
        const response = await addressAPI.getAll();
        console.log('Address response:', response.data);
        
        if (response.data && response.data.data) {
          const addressList = Array.isArray(response.data.data) ? response.data.data : [];
          console.log('Addresses loaded:', addressList);
          setAddresses(addressList);
        } else {
          console.warn('No address data in response');
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setError('Failed to load addresses. Please refresh the page.');
      }
    };
    
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.cargoname.trim()) {
      setError('Cargo name is required');
      return;
    }
    if (!formData.cargoweight || formData.cargoweight <= 0) {
      setError('Cargo weight must be greater than 0');
      return;
    }
    if (!formData.cargocount || formData.cargocount <= 0) {
      setError('Cargo count must be greater than 0');
      return;
    }
    if (!formData.addressid) {
      setError('Loading address is required');
      return;
    }
    if (!formData.unaddressid) {
      setError('Unloading address is required');
      return;
    }
    if (formData.addressid === formData.unaddressid) {
      setError('Loading and unloading addresses must be different');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const orderData = {
        cargoname: formData.cargoname.trim(),
        cargodescription: formData.cargodescription.trim(),
        cargoweight: parseFloat(formData.cargoweight),
        cargocount: parseInt(formData.cargocount),
        addressid: parseInt(formData.addressid),
        unaddressid: parseInt(formData.unaddressid),
        customerid: user?.id || 0,
      };
      
      console.log('Sending order data:', orderData);
      const response = await orderAPI.create(orderData);
      
      if (response.data && response.data.statuscode === 201) {
        alert('Order created successfully!');
        navigate('/orders');
      } else {
        setError(response.data?.message || 'Failed to create order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-order">
      <h2>Place New Order</h2>
      <p className="subtitle">Fill in the cargo and delivery details</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit} className="order-form">
        
        {/* Cargo Information Section */}
        <fieldset className="form-section">
          <legend>Cargo Details</legend>
          
          <div className="form-group">
            <label htmlFor="cargoname">Cargo Name *</label>
            <input
              type="text"
              id="cargoname"
              name="cargoname"
              value={formData.cargoname}
              onChange={handleChange}
              placeholder="e.g., Electronics, Furniture, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cargodescription">Cargo Description</label>
            <textarea
              id="cargodescription"
              name="cargodescription"
              value={formData.cargodescription}
              onChange={handleChange}
              placeholder="Provide details about the cargo (optional)"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cargoweight">Weight (kg) *</label>
              <input
                type="number"
                id="cargoweight"
                name="cargoweight"
                value={formData.cargoweight}
                onChange={handleChange}
                placeholder="e.g., 100"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cargocount">Quantity (Units) *</label>
              <input
                type="number"
                id="cargocount"
                name="cargocount"
                value={formData.cargocount}
                onChange={handleChange}
                placeholder="e.g., 5"
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Delivery Addresses Section */}
        <fieldset className="form-section">
          <legend>Delivery Addresses</legend>
          
          <div className="form-group">
            <label htmlFor="addressid">Loading Address *</label>
            <select
              id="addressid"
              name="addressid"
              value={formData.addressid}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Loading Address --</option>
              {addresses && addresses.length > 0 ? (
                addresses.map(addr => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street && addr.city && addr.state
                      ? `${addr.street}, ${addr.city}, ${addr.state}`
                      : addr.city && addr.state
                      ? `${addr.city}, ${addr.state}`
                      : addr.city
                      ? addr.city
                      : `Address ${addr.id}`}
                  </option>
                ))
              ) : (
                <option disabled>No addresses available</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="unaddressid">Unloading Address *</label>
            <select
              id="unaddressid"
              name="unaddressid"
              value={formData.unaddressid}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Unloading Address --</option>
              {addresses && addresses.length > 0 ? (
                addresses.map(addr => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street && addr.city && addr.state
                      ? `${addr.street}, ${addr.city}, ${addr.state}`
                      : addr.city && addr.state
                      ? `${addr.city}, ${addr.state}`
                      : addr.city
                      ? addr.city
                      : `Address ${addr.id}`}
                  </option>
                ))
              ) : (
                <option disabled>No addresses available</option>
              )}
            </select>
          </div>
        </fieldset>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/orders')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddOrder;
