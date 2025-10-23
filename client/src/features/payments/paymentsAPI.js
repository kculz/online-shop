import axiosInstance from '../../services/api';

export const paymentAPI = {
  /**
   * Process EcoCash payment
   * @param {Object} paymentData - Payment data
   * @param {string} paymentData.orderId - Order ID
   * @param {number} paymentData.amount - Payment amount
   * @param {string} paymentData.phoneNumber - EcoCash phone number
   * @param {string} paymentData.paymentMethod - Payment method ('ecocash')
   * @returns {Promise} - API response
   */
  processEcocashPayment: (paymentData) => {
    return axiosInstance.post('/payments/ecocash', paymentData);
  },

  /**
   * Check payment status
   * @param {string} paymentId - Payment ID
   * @returns {Promise} - API response with payment status
   */
  checkPaymentStatus: (paymentId) => {
    return axiosInstance.get(`/payments/status/${paymentId}`);
  },

  /**
   * Get payment history
   * @returns {Promise} - API response with payment history
   */
  getPaymentHistory: () => {
    return axiosInstance.get('/payments/history');
  },

  /**
   * Create order
   * @param {Object} orderData - Order data
   * @returns {Promise} - API response with created order
   */
  createOrder: (orderData) => {
    return axiosInstance.post('/orders', orderData);
  },
};

// Utility functions for payment data
export const paymentUtils = {
  /**
   * Format phone number for EcoCash
   * @param {string} phoneNumber - Raw phone number
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber: (phoneNumber) => {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Ensure it starts with 263 for Zimbabwe
    if (cleaned.startsWith('0')) {
      return '263' + cleaned.slice(1);
    } else if (cleaned.startsWith('+263')) {
      return cleaned.slice(1);
    } else if (cleaned.startsWith('263')) {
      return cleaned;
    } else {
      return '263' + cleaned;
    }
  },

  /**
   * Validate EcoCash phone number
   * @param {string} phoneNumber - Phone number to validate
   * @returns {Object} - Validation result
   */
  validateEcocashNumber: (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid Econet number
    const econetPrefixes = ['77', '78', '71', '73'];
    const prefix = cleaned.startsWith('263') ? cleaned.slice(3, 5) : 
                  cleaned.startsWith('0') ? cleaned.slice(1, 3) : 
                  cleaned.slice(0, 2);
    
    const isValid = econetPrefixes.includes(prefix) && cleaned.length >= 9;
    
    return {
      isValid,
      formatted: isValid ? paymentUtils.formatPhoneNumber(phoneNumber) : null,
      provider: isValid ? 'Econet' : 'Unknown'
    };
  }
};