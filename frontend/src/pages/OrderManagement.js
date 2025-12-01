import React, { useState, useEffect } from 'react';
import { orderAPI, carrierAPI, loadingAPI } from '../services/api';
import './OrderManagement.css';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [loadings, setLoadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignCarrierId, setAssignCarrierId] = useState('');
  const [assignLoadingId, setAssignLoadingId] = useState('');
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      console.log('Fetching all data...');
      
      const ordersResponse = await orderAPI.getAll();
      console.log('Orders Response:', ordersResponse.data);
      
      const carriersResponse = await carrierAPI.getAll();
      console.log('Carriers Response:', carriersResponse.data);

      setOrders(ordersResponse.data.data || []);
      setCarriers(carriersResponse.data.data || []);
      
      // Try to load loadings but don't fail if not available
      try {
        console.log('Fetching loadings...');
        const loadingsResponse = await loadingAPI.getAll();
        console.log('Loadings Response Status:', loadingsResponse.status);
        console.log('Loadings Response:', loadingsResponse.data);
        let loadingsData = loadingsResponse.data.data || [];
        
        // Remove duplicates by LID
        loadingsData = loadingsData.filter((loading, index, self) =>
          index === self.findIndex((l) => l.lid === loading.lid)
        );
        
        console.log('Loadings Data (deduplicated):', loadingsData);
        console.log('Loadings Count:', loadingsData.length);
        setLoadings(loadingsData);
      } catch (err) {
        console.error('Error loading loadings - Full error:', err);
        console.error('Error status:', err.response?.status);
        console.error('Error message:', err.response?.data?.message);
        console.error('Error config URL:', err.config?.url);
        console.error('Error config baseURL:', err.config?.baseURL);
        setLoadings([]);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load orders or carriers');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCarrier = async () => {
    if (!selectedOrder || !assignCarrierId) {
      setError('Please select an order and carrier');
      return;
    }

    try {
      console.log('Assigning carrier:', assignCarrierId, 'to order:', selectedOrder.id);
      const response = await fetch(
        `/api/orders/${selectedOrder.id}/assigncarrier/${parseInt(assignCarrierId)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const data = await response.json();
      console.log('Response:', data);

      if (data.statuscode === 200) {
        alert('Carrier assigned successfully');
        setShowCarrierModal(false);
        setAssignCarrierId('');
        setSelectedOrder(null);
        fetchAllData();
      } else {
        setError(data.message || 'Failed to assign carrier');
      }
    } catch (err) {
      setError('Failed to assign carrier');
      console.error('Error:', err);
    }
  };

  const handleAssignLoading = async () => {
    if (!selectedOrder || !assignLoadingId) {
      setError('Please select an order and loading');
      return;
    }

    try {
      console.log('Assigning loading:', assignLoadingId, 'to order:', selectedOrder.id);
      const response = await fetch(
        `/api/updateloading/${selectedOrder.id}/assigndate/${parseInt(assignLoadingId)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const data = await response.json();
      console.log('Response:', data);

      if (data.statuscode === 200) {
        alert('Loading date assigned successfully');
        setShowLoadingModal(false);
        setAssignLoadingId('');
        setSelectedOrder(null);
        fetchAllData();
      } else {
        setError(data.message || 'Failed to assign loading date');
      }
    } catch (err) {
      setError('Failed to assign loading date');
      console.error('Error:', err);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="order-management">
      <h2>Order Management</h2>
      <p className="subtitle">Manage orders: assign carriers and set loading dates</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="orders-table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Cargo</th>
              <th>Status</th>
              <th>Carrier</th>
              <th>Loading Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer?.name || 'N/A'}</td>
                  <td>{order.cargo?.cargoname || 'N/A'}</td>
                  <td>
                    <span className="badge" style={{
                      backgroundColor: 
                        order.status === 'placedOrder' ? '#ffc107' :
                        order.status === 'pendingOrder' ? '#17a2b8' :
                        order.status === 'cancelled' ? '#dc3545' :
                        '#28a745'
                    }}>
                      {order.status || 'N/A'}
                    </span>
                  </td>
                  <td>{order.carrier?.cname || 'Not Assigned'}</td>
                  <td>{order.loading?.ldate || 'Not Set'}</td>
                  <td>
                    {order.status === 'cancelled' ? (
                      <span className="badge" style={{ backgroundColor: '#dc3545' }}>Cancelled</span>
                    ) : !order.carrier ? (
                      // Show Assign Carrier button if no carrier assigned
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCarrierModal(true);
                        }}
                      >
                        Assign Carrier
                      </button>
                    ) : !order.loading?.ldate ? (
                      // Show Set Loading button if carrier assigned but no loading date
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowLoadingModal(true);
                        }}
                      >
                        Set Loading
                      </button>
                    ) : (
                      // Show completed status
                      <span className="badge" style={{ backgroundColor: '#28a745' }}>Completed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Carrier Modal */}
      {showCarrierModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Carrier to Order #{selectedOrder?.id}</h3>
            <div className="form-group">
              <label>Select Carrier:</label>
              <select
                value={assignCarrierId}
                onChange={(e) => setAssignCarrierId(e.target.value)}
              >
                <option value="">-- Select Carrier --</option>
                {carriers.map((carrier) => (
                  <option key={carrier.cid} value={String(carrier.cid)}>
                    {carrier.cname} - {carrier.contact}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleAssignCarrier}
              >
                Assign
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowCarrierModal(false);
                  setAssignCarrierId('');
                  setSelectedOrder(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Loading Modal */}
      {showLoadingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Loading to Order #{selectedOrder?.id}</h3>
            <div className="form-group">
              <label>Select Loading (by LID):</label>
              <select
                value={assignLoadingId}
                onChange={(e) => setAssignLoadingId(e.target.value)}
              >
                <option value="">-- Choose a Loading --</option>
                {loadings.map((loading) => (
                  <option key={loading.lid} value={String(loading.lid)}>
                    Loading #{loading.lid}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Show loading details when selected */}
            {assignLoadingId && loadings.find(l => String(l.lid) === assignLoadingId) && (
              <div style={{
                backgroundColor: '#f0f8ff',
                border: '2px solid #4169e1',
                borderRadius: '4px',
                padding: '15px',
                marginTop: '15px',
                marginBottom: '15px'
              }}>
                {(() => {
                  const selectedLoading = loadings.find(l => String(l.lid) === assignLoadingId);
                  return (
                    <>
                      <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}><strong>Selected Loading Details:</strong></p>
                      <p style={{ fontSize: '16px', margin: '8px 0', fontWeight: 'bold', color: '#4169e1' }}>
                        Loading ID: {selectedLoading.lid}
                      </p>
                      <p style={{ fontSize: '16px', margin: '8px 0', fontWeight: 'bold' }}>
                        {selectedLoading.address_id?.street}<br/>
                        {selectedLoading.address_id?.city}, {selectedLoading.address_id?.state} - {selectedLoading.address_id?.pincode}
                      </p>
                      <p style={{ fontSize: '12px', margin: '8px 0', color: '#666' }}>
                        Date: {selectedLoading.ldate} | Time: {selectedLoading.ltime}
                      </p>
                    </>
                  );
                })()}
              </div>
            )}
            
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleAssignLoading}
                disabled={!assignLoadingId}
              >
                Assign Loading
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowLoadingModal(false);
                  setAssignLoadingId('');
                  setSelectedOrder(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
