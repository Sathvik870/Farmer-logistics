import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl font-semibold">Loading...</div>
        </div>
    );
  }
  return isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export default LandingPage;