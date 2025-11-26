import React, { useState, useEffect } from 'react';
import { truckAPI, carrierAPI } from '../services/api';
import './TruckList.css';

function TruckList() {
  const [trucks, setTrucks] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [formData, setFormData] = useState({
    tid: '',
    name: '',
    numberPlate: '',
    capacity: '',
    status: 'AVAILABLE'
  });
  const [updateFormData, setUpdateFormData] = useState({
    carrier_id: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchTrucks();
    fetchCarriers();
  }, []);

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const response = await truckAPI.getAll();
      setTrucks(response.data.data || []);
    } catch (err) {
      setError('Failed to load trucks');
      console.error('Error fetching trucks:', err);
    } finally {
      setLoading(false);
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

  const handleAddTruck = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.tid || !formData.name || !formData.numberPlate || !formData.capacity) {
      setFormError('All fields are required');
      return;
    }

    try {
      const truckPayload = {
        tid: parseInt(formData.tid),
        tname: formData.name,
        tnumber: formData.numberPlate,
        tcapacity: parseInt(formData.capacity),
        tstatus: formData.status
      };

      await truckAPI.create(truckPayload);
      setFormSuccess('Truck added successfully!');
      setFormData({
        tid: '',
        name: '',
        numberPlate: '',
        capacity: '',
        status: 'AVAILABLE'
      });
      setShowForm(false);
      fetchTrucks();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add truck');
      console.error('Error adding truck:', err);
    }
  };

  const handleAssignCarrier = (truck) => {
    setSelectedTruck(truck);
    setUpdateFormData({ carrier_id: truck.carrier_id?.cid || '' });
    setShowUpdateForm(true);
  };

  const handleUpdateTruck = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!updateFormData.carrier_id) {
      setFormError('Please select a carrier');
      return;
    }

    try {
      await truckAPI.update(selectedTruck.tid, parseInt(updateFormData.carrier_id));
      setFormSuccess('Carrier assigned successfully!');
      setShowUpdateForm(false);
      setSelectedTruck(null);
      setUpdateFormData({ carrier_id: '' });
      fetchTrucks();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update truck');
      console.error('Error updating truck:', err);
    }
  };

  if (loading) return <div className="loading">Loading trucks...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="truck-list">
      <div className="truck-header">
        <h2>Trucks Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Close' : '+ Add New Truck'}
        </button>
      </div>

      {showForm && (
        <div className="add-truck-form-container">
          <h3>Add New Truck</h3>
          {formError && <div className="alert alert-danger">{formError}</div>}
          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
          
          <form onSubmit={handleAddTruck} className="add-truck-form-container">
            <div className="form-group">
              <label>Truck ID: *</label>
              <input
                type="number"
                name="tid"
                value={formData.tid}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                required
              />
            </div>

            <div className="form-group">
              <label>Truck Name: *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Truck-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Number Plate: *</label>
              <input
                type="text"
                name="numberPlate"
                value={formData.numberPlate}
                onChange={handleInputChange}
                placeholder="e.g., MH-01-AB-1234"
                required
              />
            </div>

            <div className="form-group">
              <label>Capacity (kg): *</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                required
              />
            </div>

            <div className="form-group">
              <label>Status:</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleInputChange}
              >
                <option value="AVAILABLE">Available</option>
                <option value="IN_USE">In Use</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">Add Truck</button>
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

      {showUpdateForm && selectedTruck && (
        <div className="add-truck-form-container">
          <h3>Assign Carrier to {selectedTruck.tname}</h3>
          {formError && <div className="alert alert-danger">{formError}</div>}
          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
          
          <form onSubmit={handleUpdateTruck} className="add-truck-form">
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
              <button type="submit" className="btn btn-success">Assign Carrier</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowUpdateForm(false);
                  setSelectedTruck(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="truck-table-container">
        {trucks.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Truck ID</th>
                <th>Name</th>
                <th>Number Plate</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Carrier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map((truck) => (
                <tr key={truck.tid}>
                  <td>#{truck.tid}</td>
                  <td>{truck.tname || 'N/A'}</td>
                  <td>{truck.tnumber || 'N/A'}</td>
                  <td>{truck.tcapacity || 'N/A'} kg</td>
                  <td><span className={`badge badge-${truck.tstatus?.toLowerCase() || 'available'}`}>{truck.tstatus || 'Available'}</span></td>
                  <td>{truck.carrier_id?.cname || 'N/A'}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleAssignCarrier(truck)}
                    >
                      Assign Carrier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-trucks">No trucks found. Click "Add New Truck" to create one.</p>
        )}
      </div>
    </div>
  );
}

export default TruckList;
