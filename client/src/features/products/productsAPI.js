// ============================================
// Products API (features/products/productsAPI.js)
// ============================================

import axiosInstance from '../../services/api';

export const productsAPI = {
  /**
   * Get all products with optional filtering and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.category - Filter by category
   * @param {number} params.minPrice - Minimum price filter
   * @param {number} params.maxPrice - Maximum price filter
   * @param {boolean} params.available - Filter by availability
   * @param {boolean} params.featured - Filter featured products
   * @param {string} params.search - Search term
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc/desc)
   * @returns {Promise<AxiosResponse>} - API response containing products array
   */
  getAll: (params = {}) => {
    return axiosInstance.get('/products', { params });
  },

  /**
   * Get product by ID
   * @param {string|number} id - Product ID
   * @returns {Promise<AxiosResponse>} - API response containing product data
   */
  getById: (id) => {
    return axiosInstance.get(`/products/${id}`);
  },

  /**
   * Get products by category ID
   * @param {string|number} categoryId - Category ID
   * @param {Object} params - Additional query parameters
   * @returns {Promise<AxiosResponse>} - API response containing products array
   */
  getByCategory: (categoryId, params = {}) => {
    return axiosInstance.get(`/products/category/${categoryId}`, { params });
  },

  /**
   * Get available rental products
   * @param {Object} params - Query parameters
   * @returns {Promise<AxiosResponse>} - API response containing rental products array
   */
  getRentalProducts: (params = {}) => {
    return axiosInstance.get('/products/rental/available', { params });
  },

  /**
   * Create new product (admin only)
   * @param {Object} productData - Product data
   * @returns {Promise<AxiosResponse>} - API response containing created product
   */
  create: (productData) => {
    return axiosInstance.post('/products', productData);
  },

  /**
   * Update product (admin only)
   * @param {string|number} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<AxiosResponse>} - API response containing updated product
   */
  update: (id, productData) => {
    return axiosInstance.put(`/products/${id}`, productData);
  },

  /**
   * Delete product (admin only)
   * @param {string|number} id - Product ID
   * @returns {Promise<AxiosResponse>} - API response
   */
  delete: (id) => {
    return axiosInstance.delete(`/products/${id}`);
  },

  /**
   * Toggle product availability (admin only)
   * @param {string|number} id - Product ID
   * @returns {Promise<AxiosResponse>} - API response containing updated product
   */
  toggleAvailability: (id) => {
    return axiosInstance.patch(`/products/${id}/availability`);
  },
};

// Utility functions for product data transformation
export const productUtils = {
  /**
   * Format product data for API submission
   * @param {Object} productData - Raw product data from form
   * @returns {Object} - Formatted product data for API
   */
  formatForAPI: (productData) => {
    const formatted = { ...productData };
    
    // Convert price to number
    if (formatted.price) {
      formatted.price = Number(formatted.price);
    }
    
    // Convert rental price to number if it exists
    if (formatted.rentalPrice) {
      formatted.rentalPrice = Number(formatted.rentalPrice);
    }
    
    // Ensure boolean fields are properly formatted
    const booleanFields = ['isAvailable', 'isFeatured', 'canBeRented'];
    booleanFields.forEach(field => {
      if (field in formatted) {
        formatted[field] = Boolean(formatted[field]);
      }
    });

    return formatted;
  },

  /**
   * Validate product data before submission
   * @param {Object} productData - Product data to validate
   * @returns {Object} - Validation errors object
   */
  validate: (productData) => {
    const errors = {};

    if (!productData.name || productData.name.trim().length === 0) {
      errors.name = 'Product name is required';
    }

    if (!productData.price || isNaN(productData.price) || Number(productData.price) <= 0) {
      errors.price = 'Valid price is required';
    }

    if (!productData.categoryId) {
      errors.categoryId = 'Category is required';
    }

    if (!productData.description || productData.description.trim().length === 0) {
      errors.description = 'Description is required';
    }

    return errors;
  }
};