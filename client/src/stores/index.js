// ============================================
// stores/index.js - CONSOLIDATED & CORRECTED
// ============================================
import useStore from './store';
import { shallow } from 'zustand/shallow';

// --- Utility function to wrap hooks with shallow comparison ---
const createShallowHook = (selector) => {
  return () => useStore(selector, shallow);
};

// --------------------------------------------------------------
// 1. Defined Hooks (using the utility wrapper for cleanliness)
// --------------------------------------------------------------

export const useAuth = createShallowHook(state => ({
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

export const useProducts = createShallowHook(state => ({
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
  
  // Admin Actions (assuming they live on the state object too)
  createProduct: state.createProduct,
  updateProduct: state.updateProduct,
  deleteProduct: state.deleteProduct,
  toggleAvailability: state.toggleAvailability,
  
  clearError: state.clearError,
}));

export const useCart = createShallowHook(state => ({
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
}));

export const useOrders = createShallowHook(state => ({
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
}));

export const useCategories = createShallowHook(state => ({
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
}));

export const usePayments = createShallowHook(state => ({
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
}));

export const useRentals = createShallowHook(state => ({
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
}));

export const useUsers = createShallowHook(state => ({
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
}));

// --------------------------------------------------------------
// 2. Exports
// --------------------------------------------------------------

// Export all selectors from dedicated files
export * from './selectors/authSelectors';
export * from './selectors/productSelectors';
export * from './selectors/cartSelectors';
export * from './selectors/orderSelectors';
export * from './selectors/categorySelectors';
export * from './selectors/paymentSelectors';
export * from './selectors/rentalSelectors';
export * from './selectors/userSelectors';

// Export store for direct access if needed (less common practice)
export { useStore };