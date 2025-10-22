import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaUser, FaLock, FaEye, FaEyeSlash,
  FaShieldAlt, FaArrowLeft
} from 'react-icons/fa';
import { signinThunk } from '../features/auth/authThunks';
import { clearError } from '../features/auth/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // ✅ Get all auth state from Redux store
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [localErrors, setLocalErrors] = useState({});

  // Get redirect path from location state or session storage
  const from = location.state?.from?.pathname || sessionStorage.getItem('redirectAfterLogin') || '/';

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      // Store user preference if remember me is checked
      if (rememberMe && user) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          username: user.username,
          timestamp: Date.now()
        }));
      }

      // Clear redirect path and navigate
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, rememberMe, user]);

  // Pre-fill username if remembered
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      try {
        const userData = JSON.parse(rememberedUser);
        // Check if remembered within last 30 days
        if (Date.now() - userData.timestamp < 30 * 24 * 60 * 60 * 1000) {
          setFormData(prev => ({ ...prev, username: userData.username }));
          setRememberMe(true);
        } else {
          localStorage.removeItem('rememberedUser');
        }
      } catch (error) {
        localStorage.removeItem('rememberedUser');
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear local errors when user types
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear Redux error if exists
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    dispatch(clearError());
    setLocalErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // ✅ Dispatch the signinThunk with actual user input
      await dispatch(signinThunk({
        username: formData.username.trim(),
        password: formData.password,
      })).unwrap();

      // Success handling is done in the useEffect above
      
    } catch (err) {
      // Error is already handled in the Redux state
      console.error('Login failed:', err);
      
      // Clear password on error for security
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
          disabled={isLoading}
        >
          <FaArrowLeft />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaShieldAlt className="text-3xl text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-100">Sign in to continue shopping</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Error Display */}
            {(error || Object.keys(localErrors).length > 0) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                {Object.values(localErrors).map((errorMsg, index) => (
                  <p key={index} className="text-sm text-red-600">• {errorMsg}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      localErrors.username ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your username"
                    disabled={isLoading}
                    required
                    autoComplete="username"
                  />
                </div>
                {localErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{localErrors.username}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      localErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {localErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{localErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button 
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-t-white border-white border-opacity-30 rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                  disabled={isLoading}
                >
                  Sign up for free
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <button className="text-blue-600 hover:underline">Terms</button>
              {' '}and{' '}
              <button className="text-blue-600 hover:underline">Privacy Policy</button>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center text-white text-sm">
          <p className="flex items-center justify-center gap-2">
            <FaShieldAlt className="text-green-300" />
            Secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;