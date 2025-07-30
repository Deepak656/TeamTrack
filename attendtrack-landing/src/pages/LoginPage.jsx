import React, { useState, useEffect } from 'react';
import { Camera, Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Handle OAuth2 callback and redirects
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Handle OAuth success from Spring Boot redirect
    const oauthSuccess = urlParams.get('oauth_success');
    const token = urlParams.get('token');
    const userInfo = urlParams.get('user');
    
    // Handle error from OAuth
    const error = urlParams.get('error');
    
    if (error) {
      setError(decodeURIComponent(error));
      setOauthLoading(false);
    } else if (oauthSuccess === 'true' && token && userInfo) {
      try {
        const user = JSON.parse(decodeURIComponent(userInfo));
        
        // Store auth data
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setSuccess('Login successful! Redirecting to dashboard...');
        
        // Redirect based on role
        setTimeout(() => {
          if (user.role === 'admin') {
            window.location.href = '/admin';
          } else if (user.role === 'manager') {
            window.location.href = '/manager-dashboard';
          } else {
            window.location.href = '/dashboard';
          }
        }, 1500);
      } catch (err) {
        console.error('Error parsing OAuth user data:', err);
        setError('OAuth2 login failed. Please try again.');
        setOauthLoading(false);
      }
    }
    
    // Also handle direct token/user params (legacy support)
    else if (token && userInfo && !oauthSuccess) {
      try {
        const user = JSON.parse(decodeURIComponent(userInfo));
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to appropriate dashboard
        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else if (user.role === 'manager') {
          window.location.href = '/manager-dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } catch (err) {
        setError('OAuth2 login failed. Please try again.');
        setOauthLoading(false);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          
          setSuccess('Login successful! Redirecting...');
          
          // Redirect based on role
          setTimeout(() => {
            if (result.user.role === 'admin') {
              window.location.href = '/admin';
            } else if (result.user.role === 'manager') {
              window.location.href = '/manager-dashboard';
            } else {
              window.location.href = '/dashboard';
            }
          }, 1000);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    setOauthLoading(true);
    setError('');
    setSuccess('');
    
    // Redirect to Spring Boot OAuth2 authorization endpoint
    const oauth2Endpoint = `http://localhost:8080/oauth2/authorization/google`;
    window.location.href = oauth2Endpoint;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">AttendTrack</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sign in to your account
          </h2>
          <p className="text-gray-600">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Google OAuth2 Button */}
          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={oauthLoading || loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                  Connecting to Google...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <span className="text-sm">{success}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                disabled={loading || oauthLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  disabled={loading || oauthLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loading || oauthLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading || oauthLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button 
                onClick={() => setError('')}
                className="text-sm text-blue-600 hover:text-blue-700"
                disabled={loading || oauthLoading}
              >
                Forgot your password?
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || oauthLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Admin:</strong> admin@demo.com / admin123</div>
              <div><strong>Manager:</strong> manager@demo.com / manager123</div>
              <div><strong>User:</strong> user@demo.com / user123</div>
            </div>
          </div>
        </div>

        {/* Back to landing */}
        <div className="text-center">
          <button className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center">
            ← Back to landing page
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;