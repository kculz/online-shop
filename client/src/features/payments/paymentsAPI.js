import axiosInstance from '../../services/api';
export const paymentAPI = {
  /**
   * Process EcoCash payment
   */
  async processEcocashPayment(paymentData) {
    console.log('💰 [API] Processing EcoCash payment:', paymentData);
    try {
      const response = await axiosInstance.post('/payments/ecocash', paymentData);
      console.log('✅ [API] EcoCash payment response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ [API] EcoCash payment error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  /**
   * Check payment status
   */
  async checkPaymentStatus(paymentId) {
    console.log('🔍 [API] Checking payment status:', paymentId);
    try {
      const response = await axiosInstance.get(`/payments/status/${paymentId}`);
      console.log('✅ [API] Payment status response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ [API] Payment status check error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Get payment history
   */
  async getPaymentHistory() {
    console.log('📚 [API] Getting payment history');
    try {
      const response = await axiosInstance.get('/payments/history');
      return response;
    } catch (error) {
      console.error('❌ [API] Payment history error:', error.response?.data);
      throw error;
    }
  },

  /**
   * Create order
   */
  async createOrder(orderData) {
    console.log('📦 [API] Creating order:', orderData);
    try {
      const response = await axiosInstance.post('/orders', orderData);
      console.log('✅ [API] Order creation response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ [API] Order creation error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
};

// Utility functions for payment data
export const paymentUtils = {
  /**
   * Format phone number for EcoCash
   */
  formatPhoneNumber: (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
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
   */
  validateEcocashNumber: (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
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
