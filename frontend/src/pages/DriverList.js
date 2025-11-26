import React, { useState, useEffect } from 'react';
import { driverAPI, truckAPI, carrierAPI } from '../services/api';
import './DriverList.css';

function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({
    did: '',
    dname: '',
    dcontact: ''
  });
  const [updateFormData, setUpdateFormData] = useState({
    truck_id: '',
    carrier_id: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchDrivers();
    fetchTrucks();
    fetchCarriers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await driverAPI.getAll();
      setDrivers(response.data.data || []);
    } catch (err) {
      setError('Failed to load drivers');
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrucks = async () => {
    try {
      const response = await truckAPI.getAll();
      setTrucks(response.data.data || []);
    } catch (err) {
      console.error('Error fetching trucks:', err);
    }
  };

  const fetchCarriers = async () => {
    try {
      const response = await carrierAPI.getAll();
      setCarriers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching carriers:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.did || !formData.dname || !formData.dcontact) {
      setFormError('All fields are required');
      return;
    }

    try {
      const driverPayload = {
        did: parseInt(formData.did),
        dname: formData.dname,
        dcontact: parseInt(formData.dcontact)
      };

      await driverAPI.create(driverPayload);
      setFormSuccess('Driver added successfully!');
      setFormData({
        did: '',
        dname: '',
        dcontact: ''
      });
      setShowForm(false);
      fetchDrivers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add driver');
      console.error('Error adding driver:', err);
    }
  };

  const handleAssignTruckAndCarrier = (driver) => {
    setSelectedDriver(driver);
    setUpdateFormData({
      truck_id: driver.truck_id?.tid || '',
      carrier_id: driver.carrier_id?.cid || ''
    });
    setShowUpdateForm(true);
  };

  const handleUpdateDriver = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!updateFormData.truck_id || !updateFormData.carrier_id) {
      setFormError('Please select both truck and carrier');
      return;
    }

    try {
      await driverAPI.update(
        selectedDriver.did,
        parseInt(updateFormData.truck_id),
        parseInt(updateFormData.carrier_id)
      );
      setFormSuccess('Driver updated successfully!');
      setShowUpdateForm(false);
      setSelectedDriver(null);
      setUpdateFormData({ truck_id: '', carrier_id: '' });
      fetchDrivers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update driver');
      console.error('Error updating driver:', err);
    }
  };

  if (loading) return <div className="loading">Loading drivers...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="driver-list">
      <div className="driver-header">
        <h2>Drivers Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Close' : '+ Add New Driver'}
        </button>
      </div>

      {showForm && (
        <div className="add-driver-form-container">
          <h3>Add New Driver</h3>
          {formError && <div className="alert alert-danger">{formError}</div>}
          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
          
          <form onSubmit={handleAddDriver} className="add-driver-form">
            <div className="form-group">
              <label>Driver ID: *</label>
              <input
                type="number"
                name="did"
                value={formData.did}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                required
              />
            </div>

            <div className="form-group">
              <label>Driver Name: *</label>
              <input
                type="text"
                name="dname"
                value={formData.dname}
                onChange={handleInputChange}
                placeholder="e.g., John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number: *</label>
              <input
                type="tel"
                name="dcontact"
                value={formData.dcontact}
                onChange={handleInputChange}
                placeholder="e.g., 9876543210"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">Add Driver</button>
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

      {showUpdateForm && selectedDriver && (
        <div className="add-driver-form-container">
          <h3>Assign Truck & Carrier to {selectedDriver.dname}</h3>
          {formError && <div className="alert alert-danger">{formError}</div>}
          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
          
          <form onSubmit={handleUpdateDriver} className="add-driver-form">
            <div className="form-group">
              <label>Truck: *</label>
              <select 
                name="truck_id" 
                value={updateFormData.truck_id} 
                onChange={handleUpdateInputChange}
                required
              >
                <option value="">-- Select Truck --</option>
                {trucks.map(truck => (
                  <option key={truck.tid} value={truck.tid}>
                    {truck.tname} ({truck.tnumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Carrier: *</label>
              <select 
                name="carrier_id" 
                value={updateFormData.carrier_id} 
                onChange={handleUpdateInputChange}
                required
              >
                <option value="">-- Select Carrier --</option>
                {carriers.map(carrier => (
                  <option key={carrier.cid} value={carrier.cid}>
                    {carrier.cname}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">Assign Truck & Carrier</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowUpdateForm(false);
                  setSelectedDriver(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="driver-table-container">
        {drivers.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Driver ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Truck</th>
                <th>Carrier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.did}>
                  <td>#{driver.did}</td>
                  <td>{driver.dname || 'N/A'}</td>
                  <td>{driver.dcontact || 'N/A'}</td>
                  <td>{driver.truck_id?.tname || 'N/A'}</td>
                  <td>{driver.carrier_id?.cname || 'N/A'}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleAssignTruckAndCarrier(driver)}
                    >
                      Assign Truck & Carrier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-drivers">No drivers found. Click "Add New Driver" to create one.</p>
        )}
      </div>
    </div>
  );
}

export default DriverList;
