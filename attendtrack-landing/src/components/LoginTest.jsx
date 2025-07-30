// src/components/LoginTest.js - Component for testing login functionality
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginTest = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login, user, isAuthenticated, logout } = useAuth();

  const handleTestLogin = async () => {
    setLoading(true);
    setResponse(null);
    
    try {
      const result = await login(email, password);
      setResponse(result);
    } catch (error) {
      setResponse({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        alert('Backend connection successful!');
      } else {
        alert(`Backend connection failed: ${response.status}`);
      }
    } catch (error) {
      alert(`Backend connection error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Login Test</h2>
      
      {/* Current Auth Status */}
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h3 className="font-semibold">Current Status:</h3>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        {user && (
          <div>
            <p>User: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        )}
      </div>

      {/* Test Form */}
      {!isAuthenticated && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter test email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter test password"
            />
          </div>
          
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing Login...' : 'Test Login'}
          </button>
          
          <button
            onClick={testBackendConnection}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Test Backend Connection
          </button>
        </div>
      )}

      {/* Logout Button */}
      {isAuthenticated && (
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Logout
        </button>
      )}

      {/* Response Display */}
      {response && (
        <div className="mt-4 p-3 rounded" style={{
          backgroundColor: response.success ? '#d4edda' : '#f8d7da',
          color: response.success ? '#155724' : '#721c24'
        }}>
          <h4 className="font-semibold">Response:</h4>
          <pre className="text-xs mt-2 overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Add this to your LoginPage temporarily for testing
export default LoginTest;