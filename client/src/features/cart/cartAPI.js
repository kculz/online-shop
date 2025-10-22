// ============================================
// Cart API (features/cart/cartAPI.js)
// ============================================

import axiosInstance from '../../services/api';

export const cartAPI = {
  /**
   * Get user's cart
   * @returns {Promise<AxiosResponse>} - API response containing cart data
   */
  getCart: () => {
    return axiosInstance.get('/cart');
  },

  /**
   * Add item to cart
   * @param {Object} itemData - Item data to add to cart
   * @param {string|number} itemData.productId - Product ID
   * @param {number} itemData.quantity - Quantity to add
   * @param {boolean} itemData.isForRental - Whether item is for rental
   * @returns {Promise<AxiosResponse>} - API response containing added item
   */
  addItem: (itemData) => {
    return axiosInstance.post('/cart/items', itemData);
  },

  /**
   * Update cart item quantity
   * @param {string|number} itemId - Cart item ID
   * @param {Object} updateData - Update data
   * @param {number} updateData.quantity - New quantity
   * @returns {Promise<AxiosResponse>} - API response containing updated item
   */
  updateItem: (itemId, updateData) => {
    return axiosInstance.put(`/cart/items/${itemId}`, updateData);
  },

  /**
   * Remove item from cart
   * @param {string|number} itemId - Cart item ID
   * @returns {Promise<AxiosResponse>} - API response
   */
  removeItem: (itemId) => {
    return axiosInstance.delete(`/cart/items/${itemId}`);
  },

  /**
   * Clear entire cart
   * @returns {Promise<AxiosResponse>} - API response
   */
  clearCart: () => {
    return axiosInstance.delete('/cart');
  },
};

// Utility functions for cart data transformation
export const cartUtils = {
  /**
   * Format cart item data for API submission
   * @param {Object} itemData - Raw cart item data
   * @returns {Object} - Formatted cart item data for API
   */
  formatForAPI: (itemData) => {
    const formatted = { ...itemData };
    
    // Convert quantity to number
    if (formatted.quantity) {
      formatted.quantity = Number(formatted.quantity);
    }
    
    // Ensure boolean fields are properly formatted
    if (formatted.isForRental !== undefined) {
      formatted.isForRental = Boolean(formatted.isForRental);
    }

    return formatted;
  },

  /**
   * Validate cart item data before submission
   * @param {Object} itemData - Cart item data to validate
   * @returns {Object} - Validation errors object
   */
  validate: (itemData) => {
    const errors = {};

    if (!itemData.productId) {
      errors.productId = 'Product ID is required';
    }

    if (!itemData.quantity || isNaN(itemData.quantity) || Number(itemData.quantity) <= 0) {
      errors.quantity = 'Valid quantity is required';
    }

    if (itemData.isForRental === undefined) {
      errors.isForRental = 'Rental status is required';
    }

    return errors;
  }
};