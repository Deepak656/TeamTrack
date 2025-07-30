// src/components/auth/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, role, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle role-based access control
  if (role || allowedRoles) {
    const userRole = user?.role?.toLowerCase();
    
    // Check single role
    if (role && userRole !== role.toLowerCase()) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Check multiple allowed roles
    if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

// Unauthorized page component
export const UnauthorizedPage = () => {
  const { user, logout } = useAuth();
  
  const handleGoToDashboard = () => {
    // Redirect based on user's role
    switch (user?.role?.toLowerCase()) {
      case 'admin':
        window.location.href = '/admin';
        break;
      case 'manager':
        window.location.href = '/manager';
        break;
      case 'user':
        window.location.href = '/dashboard';
        break;
      default:
        window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. 
            {user && (
              <span className="block mt-2 text-sm">
                Current role: <span className="font-semibold capitalize">{user.role}</span>
              </span>
            )}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to My Dashboard
            </button>
            
            <button
              onClick={logout}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;