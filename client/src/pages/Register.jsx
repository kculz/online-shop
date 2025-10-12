// ============================================
// pages/Register.jsx
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaArrowLeft,
  FaCheckCircle
} from 'react-icons/fa';
import useStore from '../stores/store';

const Register = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    const result = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    if (result.success) {
      // Navigate to home or dashboard
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-600 to-blue-600 flex items-center justify-center p-4 py-12">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
        >
          <FaArrowLeft />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaUser className="text-3xl text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-green-100">Join our shop and start shopping today</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Username Input */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Choose a username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
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
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">Password must contain:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-blue-500" />
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-blue-500" />
                    <span>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-blue-500" />
                    <span>One lowercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-blue-500" />
                    <span>One number or symbol</span>
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    I agree to the{' '}
                    <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                      Privacy Policy
                    </button>
                  </span>
                </label>

                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="w-4 h-4 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    Subscribe to our newsletter for exclusive deals and updates
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => navigate('/login')}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Your information is protected with industry-standard encryption
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

export default Register;