import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
