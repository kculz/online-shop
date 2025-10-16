// ============================================
// stores/actions/orderActions.js
// ============================================
import { ordersAPI } from '../../services/api';

export const createOrderActions = (set, get) => ({
  // Create order
  createOrder: async (orderData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await ordersAPI.create(orderData);
      const order = response.data;
      
      set({
        currentOrder: order,
        isLoading: false,
        error: null,
      });
      
      return { success: true, order };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create order';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Fetch user orders
  fetchUserOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await ordersAPI.getUserOrders();
      const orders = response.data;
      
      set({
        orders,
        isLoading: false,
        error: null,
      });
      
      return { success: true, orders };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch orders';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Fetch order by ID
  fetchOrderById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await ordersAPI.getOrder(id);
      const order = response.data;
      
      set({
        currentOrder: order,
        isLoading: false,
        error: null,
      });
      
      return { success: true, order };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch order';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Clear current order
  clearCurrentOrder: () => set({ currentOrder: null }),

  // Clear error
  clearError: () => set({ error: null }),
});