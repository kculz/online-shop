// ============================================
// stores/selectors/cartSelectors.js
// ============================================
export const cartSelectors = {
  // Select cart
  cart: (state) => state.cart,
  
  // Select cart items
  cartItems: (state) => state.cart?.items || [],
  
  // Select loading state
  isLoading: (state) => state.isLoading,
  
  // Select error
  error: (state) => state.error,
  
  // Derived selectors
  cartTotal: (state) => {
    const items = state.cart?.items || [];
    return items.reduce((total, item) => total + (item.priceAtAddition * item.quantity), 0);
  },
  
  cartItemCount: (state) => {
    const items = state.cart?.items || [];
    return items.reduce((count, item) => count + item.quantity, 0);
  },
  
  cartItemsWithDetails: (state) => {
    const items = state.cart?.items || [];
    return items.map(item => ({
      ...item,
      totalPrice: item.priceAtAddition * item.quantity,
    }));
  },
  
  rentalItems: (state) => 
    state.cart?.items?.filter(item => item.isForRental) || [],
  
  purchaseItems: (state) => 
    state.cart?.items?.filter(item => !item.isForRental) || [],
  
  // Check if cart is empty
  isCartEmpty: (state) => !state.cart?.items || state.cart.items.length === 0,
  
  // Get item by product ID and rental status
  getItemByProductId: (productId, isForRental = false) => (state) => 
    state.cart?.items?.find(
      item => item.productId === productId && item.isForRental === isForRental
    ) || null,
};