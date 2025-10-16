// ============================================
// stores/index.js - FIXED VERSION (Zustand Selector Pattern)
// ============================================
import useStore from './store';
import { shallow } from 'zustand/shallow';

// Helper function to apply the selector pattern to any slice hook.
// This allows components to select only the data they need and prevents
// unnecessary re-renders when other state changes, or when the entire
// state object reference changes.
const createSliceHook = (useStoreHook) => (selector, equalityFn = shallow) => {
    // If a selector is provided, use the efficient Zustand pattern
    if (selector) {
        return useStoreHook(selector, equalityFn);
    }
    
    // Fallback: If no selector is provided, return the full state/actions object (less efficient, but works).
    // This assumes the component is only using actions or needs the full object initially.
    const state = useStoreHook();
    return state;
};

// Direct selector functions for each slice

export const useAuth = createSliceHook(useStore, (state) => ({
  // State
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
  token: state.token,
  
  // Actions
  signin: state.signin,
  signup: state.signup,
  logout: state.logout,
  checkAuth: state.checkAuth,
  clearError: state.clearError,
}));

// We must refactor useProducts to accept the selector and equalityFn
export const useProducts = (selector, equalityFn = shallow) => {
  if (!selector) {
    const state = useStore();
    return {
      // State
      products: state.products,
      rentalProducts: state.rentalProducts,
      currentProduct: state.currentProduct,
      isLoading: state.isLoading,
      error: state.error,
      
      // Actions
      fetchProducts: state.fetchProducts,
      fetchProductById: state.fetchProductById,
      fetchRentalProducts: state.fetchRentalProducts,
      fetchProductsByCategory: state.fetchProductsByCategory,
      clearCurrentProduct: state.clearCurrentProduct,
      clearError: state.clearError,
    };
  }
  return useStore(selector, equalityFn); 
};


export const useCart = (selector, equalityFn = shallow) => {
  // If no selector is provided (for actions-only or simple use), use the original logic
  if (!selector) {
    const state = useStore();
    return {
      // State
      cart: state.cart,
      isLoading: state.isLoading,
      error: state.error,
      
      // Actions
      fetchCart: state.fetchCart,
      addToCart: state.addToCart,
      updateCartItem: state.updateCartItem,
      removeFromCart: state.removeFromCart,
      clearCart: state.clearCart,
      clearError: state.clearError,
    };
  }
   // ✅ Use the Zustand-idiomatic way to select state with a custom selector
  return useStore(selector, equalityFn); 
};

// We must refactor useOrders to accept the selector and equalityFn
export const useOrders = (selector, equalityFn = shallow) => {
  if (!selector) {
    const state = useStore();
    return {
      // State
      orders: state.orders,
      currentOrder: state.currentOrder,
      isLoading: state.isLoading,
      error: state.error,
      
      // Actions
      createOrder: state.createOrder,
      fetchUserOrders: state.fetchUserOrders,
      fetchOrderById: state.fetchOrderById,
      clearCurrentOrder: state.clearCurrentOrder,
      clearError: state.clearError,
    };
  }
  return useStore(selector, equalityFn);
};

// We must refactor useCategories to accept the selector and equalityFn
export const useCategories = (selector, equalityFn = shallow) => {
  if (!selector) {
    const state = useStore();
    return {
      // State
      categories: state.categories,
      currentCategory: state.currentCategory,
      isLoading: state.isLoading,
      error: state.error,
      
      // Actions
      fetchCategories: state.fetchCategories,
      fetchCategoryById: state.fetchCategoryById,
      createCategory: state.createCategory,
      updateCategory: state.updateCategory,
      deleteCategory: state.deleteCategory,
      clearCurrentCategory: state.clearCurrentCategory,
      clearError: state.clearError,
    };
  }
  return useStore(selector, equalityFn);
};

// We must refactor usePayments to accept the selector and equalityFn
export const usePayments = (selector, equalityFn = shallow) => {
  if (!selector) {
    const state = useStore();
    return {
      // State
      paymentHistory: state.paymentHistory,
      currentPayment: state.currentPayment,
      isLoading: state.isLoading,
      error: state.error,
      
      // Actions
      processEcocashPayment: state.processEcocashPayment,
      checkPaymentStatus: state.checkPaymentStatus,
      fetchPaymentHistory: state.fetchPaymentHistory,
      pollPaymentStatus: state.pollPaymentStatus,
      clearCurrentPayment: state.clearCurrentPayment,
      clearError: state.clearError,
    };
  }
  return useStore(selector, equalityFn);
};

// We must refactor useRentals to accept the selector and equalityFn
export const useRentals = (selector, equalityFn = shallow) => {
  if (!selector) {
    const state = useStore();
    return {
      // State
      rentals: state.rentals,
      allRentals: state.allRentals,
      isLoading: state.isLoading,
      error: state.error,
      
      // Actions
      fetchUserRentals: state.fetchUserRentals,
      fetchAllRentals: state.fetchAllRentals,
      processRentalReturn: state.processRentalReturn,
      checkOverdueRentals: state.checkOverdueRentals,
      extendRental: state.extendRental,
      clearError: state.clearError,
    };
  }
  return useStore(selector, equalityFn);
};

// We must refactor useUsers to accept the selector and equalityFn
export const useUsers = (selector, equalityFn = shallow) => {
  if (!selector) {
    const state = useStore();
    return {
      // State
      profile: state.profile,
      users: state.users,
      currentUser: state.currentUser,
      isLoading: state.isLoading,
      error: state.error,
      
      // Actions
      fetchProfile: state.fetchProfile,
      updateProfile: state.updateProfile,
      fetchAllUsers: state.fetchAllUsers,
      fetchUserById: state.fetchUserById,
      updateUser: state.updateUser,
      deleteUser: state.deleteUser,
      clearCurrentUser: state.clearCurrentUser,
      clearError: state.clearError,
    };
  }
  return useStore(selector, equalityFn);
};

// Export all selectors
export * from './selectors/authSelectors';
export * from './selectors/productSelectors';
export * from './selectors/cartSelectors';
export * from './selectors/orderSelectors';
export * from './selectors/categorySelectors';
export * from './selectors/paymentSelectors';
export * from './selectors/rentalSelectors';
export * from './selectors/userSelectors';

// Export store for direct access if needed
export { useStore };