// ============================================
// stores/actions/paymentActions.js
// ============================================
import { paymentsAPI } from '../../services/api';

export const createPaymentActions = (set, get) => ({
  // Process EcoCash payment
  processEcocashPayment: async (paymentData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await paymentsAPI.processEcocash(paymentData);
      const payment = response.data;
      
      set({
        currentPayment: payment,
        isLoading: false,
        error: null,
      });
      
      return { success: true, payment };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Payment processing failed';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Check payment status
  checkPaymentStatus: async (paymentId) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await paymentsAPI.checkPaymentStatus(paymentId);
      const status = response.data;
      
      set({ isLoading: false });
      
      return { success: true, status };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to check payment status';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Fetch payment history
  fetchPaymentHistory: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await paymentsAPI.getPaymentHistory();
      const paymentHistory = response.data;
      
      set({
        paymentHistory,
        isLoading: false,
        error: null,
      });
      
      return { success: true, paymentHistory };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch payment history';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Poll payment status (for real-time updates)
  pollPaymentStatus: async (paymentId, interval = 3000, maxAttempts = 10) => {
    let attempts = 0;
    
    const poll = async () => {
      attempts++;
      
      const result = await get().checkPaymentStatus(paymentId);
      
      if (result.success && result.status.status === 'paid') {
        return { success: true, status: result.status };
      }
      
      if (attempts >= maxAttempts) {
        return { success: false, error: 'Payment status check timeout' };
      }
      
      // Continue polling
      return new Promise((resolve) => {
        setTimeout(() => resolve(poll()), interval);
      });
    };
    
    return poll();
  },

  // Clear current payment
  clearCurrentPayment: () => set({ currentPayment: null }),

  // Clear error
  clearError: () => set({ error: null }),
});