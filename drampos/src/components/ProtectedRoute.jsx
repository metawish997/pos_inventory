import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  let user = null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Failed to parse user', e);
  }

  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  // Allow if super_admin or if the user has any permissions assigned
  const roleName = user.role?.name;
  const permissions = user.role?.permissions || [];
  
  if (roleName !== 'super_admin' && permissions.length === 0) {
    // If they have no permissions and aren't super_admin, they can't access the dashboard
    return <Navigate to="/error-404" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

