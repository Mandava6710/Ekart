import React, { useState, useEffect } from 'react';
import { orderAPI, carrierAPI, truckAPI } from '../services/api';
import './OrderList.css';

function OrderList() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loadings, setLoadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formSuccess, setFormSuccess] = useState('');

  // Modal states
  const [showTruckForm, setShowTruckForm] = useState(false);
  const [showCarrierForm, setShowCarrierForm] = useState(false);
  const [showLoadingForm, setShowLoadingForm] = useState(false);

  // Form data
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [selectedLoading, setSelectedLoading] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
  }, []);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchOrders(),
        fetchCarriers(),
        fetchTrucks(),
        fetchLoadings()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      console.log('Orders response:', response.data);
      
      let filteredOrders = response.data.data || [];
      console.log('All orders:', filteredOrders);
      
      if (user?.userType === 'CUSTOMER') {
        filteredOrders = filteredOrders.filter(order => {
          const customerId = order.customer?.id || order.customerId;
          return customerId === user.id;
        });
      }
      
      setOrders(filteredOrders);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    }
  };

  const fetchCarriers = async () => {
    try {
      const response = await carrierAPI.getAll();
      const carrierList = response.data.data || [];
      setCarriers(carrierList);
      console.log('Carriers loaded:', carrierList);
    } catch (err) {
      console.error('Error fetching carriers:', err);
    }
  };

  const fetchTrucks = async () => {
    try {
      const response = await truckAPI.getAll();
      const truckList = response.data.data || [];
      setTrucks(truckList);
      console.log('Trucks loaded:', truckList);
    } catch (err) {
      console.error('Error fetching trucks:', err);
    }
  };

  const fetchLoadings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/loadings');
      const data = await response.json();
      let loadingList = data.data || [];
      
      // Remove duplicates by LID
      const uniqueLoadings = loadingList.filter((loading, index, self) =>
        index === self.findIndex((l) => l.lid === loading.lid)
      );
      
      setLoadings(uniqueLoadings);
      console.log('Loadings loaded (deduplicated):', uniqueLoadings);
    } catch (err) {
      console.error('Error fetching loadings:', err);
    }
  };

  // Handlers for opening modals
  const openTruckForm = (order) => {
    setSelectedOrder(order);
    setSelectedTruck('');
    setFormError('');
    setShowTruckForm(true);
  };

  const openCarrierForm = (order) => {
    setSelectedOrder(order);
    setSelectedCarrier('');
    setFormError('');
    setShowCarrierForm(true);
  };

  const openLoadingForm = (order) => {
    setSelectedOrder(order);
    setSelectedLoading('');
    setFormError('');
    setShowLoadingForm(true);
  };

  // Handler for assigning truck (and carrier through truck)
  const handleAssignTruck = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedTruck) {
      setFormError('Please select a truck');
      return;
    }

    try {
      const tid = parseInt(selectedTruck);
      console.log('Assigning truck', tid, 'to order', selectedOrder.id);
      
      // Call: PUT /updateorder/{oid}/assigncarrier/{tid}
      await orderAPI.updateWithCarrier(selectedOrder.id, tid);
      
      setFormSuccess('Truck assigned successfully!');
      setShowTruckForm(false);
      await fetchOrders();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to assign truck');
      console.error('Error assigning truck:', err);
    }
  };

  // Handler for assigning carrier
  const handleAssignCarrier = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedCarrier) {
      setFormError('Please select a carrier');
      return;
    }

    try {
      const cid = parseInt(selectedCarrier);
      console.log('Assigning carrier', cid, 'to order', selectedOrder.id);
      
      // Call: PUT /orders/{oid}/assigncarrier/{cid}
      await orderAPI.assignCarrier(selectedOrder.id, cid);
      
      setFormSuccess('Carrier assigned successfully!');
      setShowCarrierForm(false);
      await fetchOrders();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to assign carrier');
      console.error('Error assigning carrier:', err);
    }
  };

  // Handler for assigning loading
  const handleAssignLoading = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!selectedLoading) {
      setFormError('Please select a loading');
      return;
    }

    try {
      const lid = parseInt(selectedLoading);
      console.log('Assigning loading', lid, 'to order', selectedOrder.id);
      
      // Call: PUT /updateloading/{oid}/assigndate/{lid}
      await orderAPI.updateLoading(selectedOrder.id, lid);
      
      setFormSuccess('Loading assigned successfully!');
      setShowLoadingForm(false);
      await fetchOrders();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to assign loading');
      console.error('Error assigning loading:', err);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancel(id);
        setFormSuccess('Order cancelled successfully!');
        await fetchOrders();
        setTimeout(() => setFormSuccess(''), 3000);
      } catch (err) {
        setError('Failed to cancel order');
        console.error('Error cancelling order:', err);
      }
    }
  };

  const handleComplete = async (id) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        await orderAPI.complete(id);
        setFormSuccess('Order marked as delivered!');
        await fetchOrders();
        setTimeout(() => setFormSuccess(''), 3000);
      } catch (err) {
        setError('Failed to complete order');
        console.error('Error completing order:', err);
      }
    }
  };

  if (loading) {
    return <div className="order-list-container"><div className="loading">Loading orders...</div></div>;
  }

  return (
    <div className="order-list-container">
      <h2>Order Management</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

      {/* Assign Truck Form */}
      {showTruckForm && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Assign Truck to Order #{selectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setShowTruckForm(false)}>×</button>
            </div>
            <form onSubmit={handleAssignTruck}>
              {formError && <div className="alert alert-error">{formError}</div>}
              
              <div className="form-group">
                <label htmlFor="truck">Select Truck (by ID):</label>
                <select 
                  id="truck"
                  value={selectedTruck} 
                  onChange={(e) => setSelectedTruck(e.target.value)}
                  required
                >
                  <option value="">-- Choose a Truck --</option>
                  {trucks.map(truck => (
                    <option key={truck.tid} value={truck.tid}>
                      {truck.tname} (ID: {truck.tid}, Plate: {truck.tnumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Assign Truck</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTruckForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Carrier Form */}
      {showCarrierForm && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Assign Carrier to Order #{selectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setShowCarrierForm(false)}>×</button>
            </div>
            <form onSubmit={handleAssignCarrier}>
              {formError && <div className="alert alert-error">{formError}</div>}
              
              <div className="form-group">
                <label htmlFor="carrier">Select Carrier (by CID):</label>
                <select 
                  id="carrier"
                  value={selectedCarrier} 
                  onChange={(e) => setSelectedCarrier(e.target.value)}
                  required
                >
                  <option value="">-- Choose a Carrier --</option>
                  {carriers.map(carrier => (
                    <option key={carrier.cid} value={carrier.cid}>
                      {carrier.cname} (ID: {carrier.cid}, Email: {carrier.cmail})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Assign Carrier</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCarrierForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Loading Form */}
      {showLoadingForm && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Assign Loading to Order #{selectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setShowLoadingForm(false)}>×</button>
            </div>
            <form onSubmit={handleAssignLoading}>
              {formError && <div className="alert alert-error">{formError}</div>}
              
              <div className="form-group">
                <label htmlFor="loading">Select Loading (by LID):</label>
                <select 
                  id="loading"
                  value={selectedLoading} 
                  onChange={(e) => setSelectedLoading(e.target.value)}
                  required
                >
                  <option value="">-- Choose a Loading --</option>
                  {loadings.map(load => (
                    <option key={load.lid} value={load.lid}>
                      LID: {load.lid} - {load.address_id?.street}, {load.address_id?.city}, {load.address_id?.state} {load.address_id?.pincode}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Show loading details when selected */}
              {selectedLoading && loadings.find(l => String(l.lid) === String(selectedLoading)) && (
                <div style={{
                  backgroundColor: '#f0f8ff',
                  border: '2px solid #4169e1',
                  borderRadius: '4px',
                  padding: '12px',
                  marginTop: '10px',
                  marginBottom: '10px',
                  fontSize: '14px'
                }}>
                  {(() => {
                    const selectedLoadingData = loadings.find(l => String(l.lid) === String(selectedLoading));
                    return (
                      <>
                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#4169e1' }}>
                          Loading ID: {selectedLoadingData.lid}
                        </p>
                        <p style={{ margin: '0 0 4px 0' }}>
                          {selectedLoadingData.address_id?.street}
                        </p>
                        <p style={{ margin: '0 0 4px 0' }}>
                          {selectedLoadingData.address_id?.city}, {selectedLoadingData.address_id?.state} - {selectedLoadingData.address_id?.pincode}
                        </p>
                        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                          Date: {selectedLoadingData.ldate} | Time: {selectedLoadingData.ltime}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Assign Loading</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLoadingForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Cargo</th>
              <th>Weight</th>
              <th>Truck</th>
              <th>Carrier</th>
              <th>Loading</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.id} className={`status-${order.status?.toLowerCase()}`}>
                  <td><strong>#{order.id}</strong></td>
                  <td>{order.customer?.name || 'N/A'}</td>
                  <td>{order.cargo?.name || 'N/A'}</td>
                  <td>{order.cargo?.weight ? `${order.cargo.weight} kg` : 'N/A'}</td>
                  <td>{order.truck?.tname || 'Not Assigned'}</td>
                  <td>{order.carrier?.cname || 'Not Assigned'}</td>
                  <td>{order.loading?.lid || 'Not Assigned'}</td>
                  <td>
                    <span className={`badge badge-${order.status?.toLowerCase()}`}>
                      {order.status === 'placedOrder' && '📋 Placed'}
                      {order.status === 'pendingDelivery' && '⏳ Pending Delivery'}
                      {order.status === 'shipped' && '🚚 Shipped'}
                      {order.status === 'delivered' && '✅ Delivered'}
                      {order.status === 'cancelled' && '❌ Cancelled'}
                      {!order.status && 'Placed'}
                    </span>
                  </td>
                  <td>{new Date(order.orderdate).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => openTruckForm(order)}
                      disabled={order.status === 'cancelled' || order.status === 'delivered'}
                      title="Assign Truck by ID"
                    >
                      Truck
                    </button>
                    <button 
                      className="btn btn-sm btn-info" 
                      onClick={() => openCarrierForm(order)}
                      disabled={order.status === 'cancelled' || order.status === 'delivered'}
                      title="Assign Carrier by CID"
                    >
                      Carrier
                    </button>
                    <button 
                      className="btn btn-sm btn-warning" 
                      onClick={() => openLoadingForm(order)}
                      disabled={order.status === 'cancelled' || order.status === 'delivered'}
                      title="Assign Loading by LID"
                    >
                      Loading
                    </button>
                    <button 
                      className="btn btn-sm btn-success" 
                      onClick={() => handleComplete(order.id)}
                      disabled={order.status !== 'shipped'}
                      title="Mark as Delivered"
                    >
                      Complete
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleCancel(order.id)}
                      disabled={order.status === 'cancelled' || order.status === 'delivered'}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;