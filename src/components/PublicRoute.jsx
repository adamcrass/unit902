// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // If authenticated, redirect to profile page
  if (user) {
    return <Navigate to="/profile" replace />;
  }

  // If not authenticated, render the public component (login page)
  return children;
};

export default PublicRoute;
