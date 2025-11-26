import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element, requiredRole }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified, check if user has that role
  if (requiredRole && user.userType !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has the required role
  return element;
}

export default PrivateRoute;
