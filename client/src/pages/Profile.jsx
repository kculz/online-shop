// ============================================
// pages/Profile.jsx - User Profile Management
// ============================================
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaKey,
  FaSave,
  FaTimes,
  FaEdit,
  FaShieldAlt,
  FaCalendar,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

// Import Redux actions and selectors
import { fetchProfileThunk, updateProfileThunk } from '../features/users/usersThunks';
import { clearProfileError, updateProfileLocally } from '../features/users/usersSlice';
import {
  selectProfile,
  selectProfileLoading,
  selectProfileError,
  selectProfileUpdating,
  selectProfileUpdateError
} from '../features/users/usersSelectors';
import { userUtils } from '../features/users/usersAPI';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux Selectors
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);
  const updating = useSelector(selectProfileUpdating);
  const updateError = useSelector(selectProfileUpdateError);

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch profile on component mount
  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [profile]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearProfileError());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const validationErrors = userUtils.validateProfile(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare update data (only include fields that changed)
      const updateData = {};
      if (formData.username !== profile.username) updateData.username = formData.username;
      if (formData.email !== profile.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;

      // Don't send empty update
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        return;
      }

      await dispatch(updateProfileThunk(updateData)).unwrap();
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      // Error is handled by Redux
      console.error('Profile update failed:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile?.username || '',
      email: profile?.email || '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setIsEditing(false);
    setSuccessMessage('');
  };

  const RoleBadge = ({ role }) => {
    const roleConfig = userUtils.formatRole(role);
    return (
      <span className={`badge ${roleConfig.badgeColor} badge-lg`}>
        {roleConfig.text}
      </span>
    );
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUser className="text-6xl text-blue-600 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Loading Profile...</h2>
          <p className="text-gray-600">Please wait while we fetch your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
                <FaUser />
                My Profile
              </h1>
              <p className="text-blue-100">Manage your account information and preferences</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2"
              >
                <FaEdit />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-600 text-xl" />
                <div>
                  <h3 className="text-green-800 font-semibold">Success!</h3>
                  <p className="text-green-600">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {(error || updateError) && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-red-600 text-xl" />
                <div>
                  <h3 className="text-red-800 font-semibold">Error</h3>
                  <p className="text-red-600">{error || updateError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Information
                </h2>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.username ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your username"
                        />
                      </div>
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaKey className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.password ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter new password (optional)"
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    {formData.password && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaKey className="text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Confirm your password"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={updating}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Read-only view */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <p className="text-lg font-semibold text-gray-900">{profile?.username}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <p className="text-lg font-semibold text-gray-900">{profile?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <RoleBadge role={profile?.role} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member Since
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {userUtils.formatDate(profile?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Summary */}
            <div className="space-y-6">
              {/* Role Info */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-blue-600" />
                  Account Type
                </h3>
                <RoleBadge role={profile?.role} />
                <p className="text-sm text-gray-600 mt-2">
                  {profile?.role === 'admin' 
                    ? 'You have full administrative access to the system.'
                    : 'You have standard user access.'
                  }
                </p>
              </div>

              {/* Account Stats */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCalendar className="text-green-600" />
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {userUtils.formatDate(profile?.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-semibold text-gray-900">
                      {userUtils.formatDate(profile?.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {profile?.role === 'admin' && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Admin Actions
                  </h3>
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all"
                  >
                    Manage Users
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;