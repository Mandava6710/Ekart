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
      const ordersResponse = await orderAPI.getAll();
      const carriersResponse = await carrierAPI.getAll();

      setOrders(ordersResponse.data.data || []);
      setCarriers(carriersResponse.data.data || []);
      
      // Try to load loadings but don't fail if not available
      try {
        const loadingsResponse = await loadingAPI.getAll();
        setLoadings(loadingsResponse.data.data || []);
      } catch (err) {
        console.warn('Could not load loadings data:', err);
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
        `http://localhost:8080/orders/${selectedOrder.id}/assigncarrier/${parseInt(assignCarrierId)}`,
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
        `http://localhost:8080/updateloading/${selectedOrder.id}/assigndate/${parseInt(assignLoadingId)}`,
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
            <h3>Set Loading Date for Order #{selectedOrder?.id}</h3>
            {selectedOrder?.loading?.id ? (
              <>
                <div className="info-message">
                  <p><strong>Loading ID:</strong> {selectedOrder?.loading?.id}</p>
                  <p><strong>Address:</strong> {selectedOrder?.loading?.address_id?.city}, {selectedOrder?.loading?.address_id?.state}</p>
                  <p>Click "Set Loading" to update the loading date and time to today.</p>
                </div>
                <div className="modal-actions">
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      try {
                        console.log('Setting loading date for loading ID:', selectedOrder.loading.id);
                        const response = await fetch(
                          `http://localhost:8080/updateloading/${selectedOrder.id}/assigndate/${selectedOrder.loading.id}`,
                          {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' }
                          }
                        );
                        const data = await response.json();
                        console.log('Response:', data);

                        if (data.statuscode === 200) {
                          alert('Loading date set successfully');
                          setShowLoadingModal(false);
                          setSelectedOrder(null);
                          fetchAllData();
                        } else {
                          setError(data.message || 'Failed to set loading date');
                        }
                      } catch (err) {
                        setError('Failed to set loading date');
                        console.error('Error:', err);
                      }
                    }}
                  >
                    Set Loading Date Today
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
              </>
            ) : (
              <>
                <div className="info-message" style={{ backgroundColor: '#ffe7e7', borderLeftColor: '#dc3545' }}>
                  <p>No loading information available for this order.</p>
                </div>
                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowLoadingModal(false);
                      setAssignLoadingId('');
                      setSelectedOrder(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
