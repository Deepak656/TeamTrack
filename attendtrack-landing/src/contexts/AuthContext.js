// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure your Spring Boot backend URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Optionally verify token is still valid
        verifyToken(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuthData();
      }
    }
    setLoading(false);
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.warn('Token verification failed:', error);
      clearAuthData();
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email }); // Don't log password
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password 
        }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        // Handle different error status codes
        let errorMessage = 'Login failed';
        
        if (response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (response.status === 403) {
          errorMessage = 'Account is locked or disabled';
        } else if (response.status === 404) {
          errorMessage = 'User not found';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later';
        }

        // Try to get error message from response
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Use default error message
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login successful:', { user: data.user?.email, role: data.user?.role });

      // Validate response structure
      if (!data.token || !data.user) {
        throw new Error('Invalid response format from server');
      }

      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      return { success: true, user: data.user };

    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      return { 
        success: false, 
        error: error.message || 'Network error. Please check your connection.' 
      };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Call logout endpoint if available
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.warn('Logout API call failed:', error);
        }
      }
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      // Always clear local data
      clearAuthData();
    }
  };

  // Function to get auth headers for API calls
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Function to make authenticated API calls
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle token expiration
      if (response.status === 401) {
        clearAuthData();
        window.location.href = '/login';
        return null;
      }

      return response;
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    getAuthHeaders,
    authenticatedFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};