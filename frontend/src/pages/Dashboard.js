import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, truckAPI, driverAPI } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalTrucks: 0,
    totalDrivers: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        
        if (user.userType === 'CUSTOMER') {
          // Customer: Show only their orders
          const ordersRes = await orderAPI.getAll();
          const allOrders = ordersRes.data.data || [];
          const customerId = user.id;
          const customerOrders = allOrders.filter(order => {
            const orderCustomerId = order.customer?.id || order.customerId;
            return orderCustomerId === customerId;
          });
          
          setStats({
            totalOrders: customerOrders.length,
            totalTrucks: 0,
            totalDrivers: 0,
            recentOrders: customerOrders.slice(0, 5),
          });
        } else if (user.userType === 'ADMIN') {
          // Admin: Show all stats
          const [ordersRes, trucksRes, driversRes] = await Promise.all([
            orderAPI.getAll(),
            truckAPI.getAll(),
            driverAPI.getAll(),
          ]);

          const orders = ordersRes.data.data || [];
          const trucks = trucksRes.data.data || [];
          const drivers = driversRes.data.data || [];

          setStats({
            totalOrders: orders.length,
            totalTrucks: trucks.length,
            totalDrivers: drivers.length,
            recentOrders: orders.slice(0, 5),
          });
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      {user?.userType === 'CUSTOMER' && (
        <div className="customer-dashboard">
          <div className="welcome-message">
            <p>Welcome, {user.name}! Manage your orders below.</p>
          </div>
          
          <div className="stats-container">
            <div className="stat-card">
              <h3>Your Orders</h3>
              <p className="stat-number">{stats.totalOrders}</p>
              <Link to="/orders" className="btn btn-primary btn-small">View Orders</Link>
            </div>
            <div className="stat-card">
              <h3>Quick Actions</h3>
              <Link to="/add-order" className="btn btn-success btn-small">Place New Order</Link>
            </div>
          </div>

          <div className="recent-section">
            <h3>Your Recent Orders</h3>
            {stats.recentOrders.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.status || 'Pending'}</td>
                      <td>{order.orderdate ? new Date(order.orderdate).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <Link to={`/orders/${order.id}`} className="btn btn-sm btn-primary">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>You haven't placed any orders yet. <Link to="/add-order">Place an order now</Link></p>
            )}
          </div>
        </div>
      )}

      {user?.userType === 'ADMIN' && (
        <div className="admin-dashboard">
          <div className="welcome-message">
            <p>Welcome Admin, {user.name}! Manage all system resources below.</p>
          </div>
          
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-number">{stats.totalOrders}</p>
              <Link to="/orders" className="btn btn-primary btn-small">View Orders</Link>
            </div>
            <div className="stat-card">
              <h3>Total Trucks</h3>
              <p className="stat-number">{stats.totalTrucks}</p>
              <Link to="/trucks" className="btn btn-primary btn-small">View Trucks</Link>
            </div>
            <div className="stat-card">
              <h3>Total Drivers</h3>
              <p className="stat-number">{stats.totalDrivers}</p>
              <Link to="/drivers" className="btn btn-primary btn-small">View Drivers</Link>
            </div>
          </div>

          <div className="recent-section">
            <h3>Recent Orders</h3>
            {stats.recentOrders.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.status || 'Pending'}</td>
                      <td>{order.orderdate ? new Date(order.orderdate).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <Link to={`/orders/${order.id}`} className="btn btn-sm btn-primary">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
