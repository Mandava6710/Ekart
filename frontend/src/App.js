import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import OrderList from './pages/OrderList';
import AddOrder from './pages/AddOrder';
import OrderManagement from './pages/OrderManagement';
import TruckList from './pages/TruckList';
import DriverList from './pages/DriverList';
import CarrierList from './pages/CarrierList';
import CustomerList from './pages/CustomerList';
import AdminList from './pages/AdminList';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

function NavBar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Watch for storage changes
  useEffect(() => {
    window.addEventListener('storage', () => {
      const userData = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(userData);
    });
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" onClick={closeMobileMenu}>
            <div className="brand-logo">📦</div>
            <h1>Ekart</h1>
          </Link>
        </div>

        <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              {/* Customer Menu */}
              {user.userType === 'CUSTOMER' && (
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                      🏠 Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/orders" className="nav-link" onClick={closeMobileMenu}>
                      📋 My Orders
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/add-order" className="nav-link" onClick={closeMobileMenu}>
                      ➕ Place Order
                    </Link>
                  </li>
                </>
              )}
              
              {/* Admin Menu */}
              {user.userType === 'ADMIN' && (
                <>
                  <li className="nav-item">
                    <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                      🏠 Dashboard
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <span className="nav-link dropdown-toggle">📦 Management ▼</span>
                    <div className="dropdown-menu">
                      <Link to="/orders" className="dropdown-item" onClick={closeMobileMenu}>📋 View Orders</Link>
                      <Link to="/order-management" className="dropdown-item" onClick={closeMobileMenu}>⚙️ Manage Orders</Link>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <span className="nav-link dropdown-toggle">🚚 Fleet ▼</span>
                    <div className="dropdown-menu">
                      <Link to="/trucks" className="dropdown-item" onClick={closeMobileMenu}>🚛 Trucks</Link>
                      <Link to="/drivers" className="dropdown-item" onClick={closeMobileMenu}>👤 Drivers</Link>
                      <Link to="/carriers" className="dropdown-item" onClick={closeMobileMenu}>🏢 Carriers</Link>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <span className="nav-link dropdown-toggle">👥 Users ▼</span>
                    <div className="dropdown-menu">
                      <Link to="/customers" className="dropdown-item" onClick={closeMobileMenu}>👨 Customers</Link>
                      <Link to="/admins" className="dropdown-item" onClick={closeMobileMenu}>🔐 Admins</Link>
                    </div>
                  </li>
                </>
              )}
              
              <li className="nav-item nav-divider"></li>
              
              <li className="nav-item user-profile">
                <div className="user-avatar">👤</div>
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                  <div className="user-role">{user.userType}</div>
                </div>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="login-link" onClick={closeMobileMenu}>
                🔐 Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />

        <main className="container main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - Both Customer and Admin */}
            <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/orders" element={<PrivateRoute element={<OrderList />} />} />

            {/* Protected Routes - Customer Only */}
            <Route path="/add-order" element={<PrivateRoute element={<AddOrder />} requiredRole="CUSTOMER" />} />

            {/* Protected Routes - Admin Only */}
            <Route path="/order-management" element={<PrivateRoute element={<OrderManagement />} requiredRole="ADMIN" />} />
            <Route path="/trucks" element={<PrivateRoute element={<TruckList />} requiredRole="ADMIN" />} />
            <Route path="/drivers" element={<PrivateRoute element={<DriverList />} requiredRole="ADMIN" />} />
            <Route path="/carriers" element={<PrivateRoute element={<CarrierList />} requiredRole="ADMIN" />} />
            <Route path="/customers" element={<PrivateRoute element={<CustomerList />} requiredRole="ADMIN" />} />
            <Route path="/admins" element={<PrivateRoute element={<AdminList />} requiredRole="ADMIN" />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2024 Ekart Cargo Management System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
