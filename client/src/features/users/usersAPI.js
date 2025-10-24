import axiosInstance from '../../services/api';

export const userAPI = {
  /**
   * Get current user profile
   * @returns {Promise} - API response containing user profile
   */
  getProfile: () => {
    return axiosInstance.get('/users/profile');
  },

  /**
   * Update current user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise} - API response containing updated profile
   */
  updateProfile: (profileData) => {
    return axiosInstance.put('/users/profile', profileData);
  },

  /**
   * Get all users (admin only)
   * @returns {Promise} - API response containing users list
   */
  getAllUsers: () => {
    return axiosInstance.get('/users');
  },

  /**
   * Get user by ID
   * @param {string|number} userId - User ID
   * @returns {Promise} - API response containing user data
   */
  getUserById: (userId) => {
    return axiosInstance.get(`/users/${userId}`);
  },

  /**
   * Update user (admin or own profile)
   * @param {string|number} userId - User ID
   * @param {Object} userData - User update data
   * @returns {Promise} - API response containing updated user
   */
  updateUser: (userId, userData) => {
    return axiosInstance.put(`/users/${userId}`, userData);
  },

  /**
   * Delete user (admin or own profile)
   * @param {string|number} userId - User ID
   * @returns {Promise} - API response
   */
  deleteUser: (userId) => {
    return axiosInstance.delete(`/users/${userId}`);
  },
};

// Utility functions for user data
export const userUtils = {
  /**
   * Validate profile update data
   * @param {Object} profileData - Profile data to validate
   * @returns {Object} - Validation errors object
   */
  validateProfile: (profileData) => {
    const errors = {};

    if (profileData.username && profileData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }

    if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (profileData.password && profileData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (profileData.password && !profileData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    }

    if (profileData.password && profileData.confirmPassword && 
        profileData.password !== profileData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  },

  /**
   * Format user role for display
   * @param {string} role - User role
   * @returns {Object} - Formatted role with color and display text
   */
  formatRole: (role) => {
    const roleConfig = {
      admin: { 
        text: 'Administrator', 
        color: 'text-red-600', 
        bgColor: 'bg-red-100',
        badgeColor: 'badge-error'
      },
      user: { 
        text: 'User', 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-100',
        badgeColor: 'badge-info'
      },
      vendor: { 
        text: 'Vendor', 
        color: 'text-green-600', 
        bgColor: 'bg-green-100',
        badgeColor: 'badge-success'
      }
    };

    return roleConfig[role] || { 
      text: role, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-100',
      badgeColor: 'badge-ghost'
    };
  },

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} - Formatted date
   */
  formatDate: (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
};