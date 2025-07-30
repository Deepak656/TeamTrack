import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPagev2';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboard';
import ManagerDashboardPage from './pages/ManagerDashboard';
import UserDashboardPage from './pages/UserDashboard';
import ProtectedRoute, { UnauthorizedPage } from './components/auth/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Protected Routes - Admin Only */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Manager and Admin */}
          <Route 
            path="/manager" 
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <ManagerDashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - All authenticated users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute role="user">
                <UserDashboardPage />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route - redirect to appropriate dashboard based on role */}
          <Route 
            path="*" 
            element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Component to redirect users to their appropriate dashboard
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role?.toLowerCase()) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'manager':
      return <Navigate to="/manager" replace />;
    case 'user':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default App;