// ============================================
// 7. Enhanced Cart State Management
// ============================================
// File: client/src/stores/slices/cartSlice.js (enhanced version)
// ============================================
import { createCartActions } from '../actions/cartActions';

const initialState = {
  cart: null,
  isLoading: false,
  error: null,
  lastFetch: null, // ✅ Track when cart was last fetched
};

export const cartSlice = (set, get) => ({
  ...initialState,
  
  ...createCartActions(set, get),
  
  // ✅ Add method to check if cart needs refresh
  shouldRefreshCart: () => {
    const state = get();
    if (!state.lastFetch) return true;
    
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - state.lastFetch > fiveMinutes;
  },
  
  // ✅ Override fetchCart to track last fetch
  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await cartAPI.getCart();
      const cart = response.data;
      
      set({
        cart,
        isLoading: false,
        error: null,
        lastFetch: Date.now(), // ✅ Track fetch time
      });
      
      return { success: true, cart };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch cart';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },
});
