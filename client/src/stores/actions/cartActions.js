// ============================================
// stores/actions/cartActions.js
// ============================================
import { cartAPI } from '../../services/api';

export const createCartActions = (set, get) => ({
  // Fetch cart
  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await cartAPI.getCart();
      const cart = response.data;
      
      set({
        cart,
        isLoading: false,
        error: null,
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

  // Add item to cart
  addToCart: async (itemData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await cartAPI.addItem(itemData);
      const cartItem = response.data;
      
      // Update local cart state
      const { cart } = get();
      if (cart) {
        const existingItem = cart.items.find(
          item => item.productId === itemData.productId && item.isForRental === itemData.isForRental
        );
        
        if (existingItem) {
          existingItem.quantity += itemData.quantity;
        } else {
          cart.items.push(cartItem);
        }
        
        set({ cart: { ...cart }, isLoading: false });
      } else {
        // If no cart exists, fetch the updated cart
        await get().fetchCart();
      }
      
      return { success: true, cartItem };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to add item to cart';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Update cart item
  updateCartItem: async (itemId, itemData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await cartAPI.updateItem(itemId, itemData);
      const updatedItem = response.data;
      
      // Update local cart state
      const { cart } = get();
      if (cart) {
        const itemIndex = cart.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          cart.items[itemIndex] = { ...cart.items[itemIndex], ...updatedItem };
          set({ cart: { ...cart }, isLoading: false });
        }
      }
      
      return { success: true, updatedItem };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update cart item';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      set({ isLoading: true, error: null });
      
      await cartAPI.removeItem(itemId);
      
      // Update local cart state
      const { cart } = get();
      if (cart) {
        cart.items = cart.items.filter(item => item.id !== itemId);
        set({ cart: { ...cart }, isLoading: false });
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to remove item from cart';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      set({ isLoading: true, error: null });
      
      await cartAPI.clearCart();
      
      set({
        cart: null,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to clear cart';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
});