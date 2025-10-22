// ============================================
// Categories API (features/categories/categoriesAPI.js)
// ============================================

import axiosInstance from '../../services/api';

export const categoriesAPI = {
  /**
   * Get all categories
   * @returns {Promise<AxiosResponse>} - API response containing categories array
   */
  getCategories: () => {
    return axiosInstance.get('/categories');
  },

  /**
   * Get category by ID
   * @param {string|number} id - Category ID
   * @returns {Promise<AxiosResponse>} - API response containing category data
   */
  getCategoryById: (id) => {
    return axiosInstance.get(`/categories/${id}`);
  },

  /**
   * Create new category (admin only)
   * @param {Object} categoryData - Category data
   * @returns {Promise<AxiosResponse>} - API response containing created category
   */
  createCategory: (categoryData) => {
    return axiosInstance.post('/categories', categoryData);
  },

  /**
   * Update category (admin only)
   * @param {string|number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<AxiosResponse>} - API response containing updated category
   */
  updateCategory: (id, categoryData) => {
    return axiosInstance.put(`/categories/${id}`, categoryData);
  },

  /**
   * Delete category (admin only)
   * @param {string|number} id - Category ID
   * @returns {Promise<AxiosResponse>} - API response
   */
  deleteCategory: (id) => {
    return axiosInstance.delete(`/categories/${id}`);
  },
};

// Utility functions for category data transformation
export const categoryUtils = {
  /**
   * Format category data for API submission
   * @param {Object} categoryData - Raw category data
   * @returns {Object} - Formatted category data for API
   */
  formatForAPI: (categoryData) => {
    const formatted = { ...categoryData };
    
    // Ensure boolean fields are properly formatted
    if (formatted.isActive !== undefined) {
      formatted.isActive = Boolean(formatted.isActive);
    }

    // Trim string fields
    if (formatted.name) {
      formatted.name = formatted.name.trim();
    }
    
    if (formatted.description) {
      formatted.description = formatted.description.trim();
    }

    return formatted;
  },

  /**
   * Validate category data before submission
   * @param {Object} categoryData - Category data to validate
   * @returns {Object} - Validation errors object
   */
  validate: (categoryData) => {
    const errors = {};

    if (!categoryData.name || categoryData.name.trim().length === 0) {
      errors.name = 'Category name is required';
    } else if (categoryData.name.trim().length < 2) {
      errors.name = 'Category name must be at least 2 characters';
    }

    if (categoryData.description && categoryData.description.trim().length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    return errors;
  }
};