import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = ['user', 'admin', 'founder'] }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  
  // If auth is still loading, show loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has the required role
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and has the required role, render the protected component
  return <Outlet />;
};

export default ProtectedRoute;