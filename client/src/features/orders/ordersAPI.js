import axiosInstance from '../../services/api';

export const ordersAPI = {
  /**
   * Get user's orders
   * @returns {Promise} - API response containing orders data
   */
  getOrders: () => {
    return axiosInstance.get('/orders');
  },

  /**
   * Get specific order by ID
   * @param {string|number} orderId - Order ID
   * @returns {Promise} - API response containing order data
   */
  getOrder: (orderId) => {
    return axiosInstance.get(`/orders/${orderId}`);
  },

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @returns {Promise} - API response containing created order
   */
  createOrder: (orderData) => {
    return axiosInstance.post('/orders', orderData);
  },
};

// Utility functions for order data transformation
export const ordersUtils = {
  /**
   * Format order status for display
   * @param {string} status - Order status
   * @returns {Object} - Formatted status with color and display text
   */
  formatStatus: (status) => {
    const statusConfig = {
      pending: { 
        text: 'Pending', 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-100',
        badgeColor: 'badge-warning'
      },
      payment_pending: { 
        text: 'Payment Pending', 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-100',
        badgeColor: 'badge-warning'
      },
      processing: { 
        text: 'Processing', 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-100',
        badgeColor: 'badge-info'
      },
      confirmed: { 
        text: 'Confirmed', 
        color: 'text-green-600', 
        bgColor: 'bg-green-100',
        badgeColor: 'badge-success'
      },
      shipped: { 
        text: 'Shipped', 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-100',
        badgeColor: 'badge-primary'
      },
      delivered: { 
        text: 'Delivered', 
        color: 'text-green-600', 
        bgColor: 'bg-green-100',
        badgeColor: 'badge-success'
      },
      cancelled: { 
        text: 'Cancelled', 
        color: 'text-red-600', 
        bgColor: 'bg-red-100',
        badgeColor: 'badge-error'
      }
    };

    return statusConfig[status] || { 
      text: status, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-100',
      badgeColor: 'badge-ghost'
    };
  },

  /**
   * Calculate order totals
   * @param {Array} items - Order items
   * @returns {Object} - Calculated totals
   */
  calculateTotals: (items) => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  },

  /**
   * Get user's orders
   * @returns {Promise} - API response containing orders data
   */
  getOrders: () => {
    return axiosInstance.get('/orders');
  },

  /**
   * Get all orders (admin only)
   * @returns {Promise} - API response containing all orders
   */
  getAllOrders: () => {
    return axiosInstance.get('/admin/orders');
  },

  /**
   * Get specific order by ID
   * @param {string|number} orderId - Order ID
   * @returns {Promise} - API response containing order data
   */
  getOrder: (orderId) => {
    return axiosInstance.get(`/orders/${orderId}`);
  },

  /**
   * Get order by ID (admin - with full details)
   * @param {string|number} orderId - Order ID
   * @returns {Promise} - API response containing order data
   */
  getAdminOrder: (orderId) => {
    return axiosInstance.get(`/admin/orders/${orderId}`);
  },

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @returns {Promise} - API response containing created order
   */
  createOrder: (orderData) => {
    return axiosInstance.post('/orders', orderData);
  },

  /**
   * Update order status (admin only)
   * @param {string|number} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise} - API response containing updated order
   */
  updateOrderStatus: (orderId, status) => {
    return axiosInstance.put(`/admin/orders/${orderId}/status`, { status });
  },

  /**
   * Delete order (admin only)
   * @param {string|number} orderId - Order ID
   * @returns {Promise} - API response
   */
  deleteOrder: (orderId) => {
    return axiosInstance.delete(`/admin/orders/${orderId}`);
  },

  /**
   * Get order statistics (admin only)
   * @returns {Promise} - API response containing order statistics
   */
  getOrderStats: () => {
    return axiosInstance.get('/admin/orders/stats');
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