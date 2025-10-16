// ============================================
// stores/selectors/orderSelectors.js
// ============================================
export const orderSelectors = {
  // Select all orders
  orders: (state) => state.orders,
  
  // Select current order
  currentOrder: (state) => state.currentOrder,
  
  // Select loading state
  isLoading: (state) => state.isLoading,
  
  // Select error
  error: (state) => state.error,
  
  // Derived selectors
  pendingOrders: (state) => 
    state.orders?.filter(order => order.status === 'pending') || [],
  
  confirmedOrders: (state) => 
    state.orders?.filter(order => order.status === 'confirmed') || [],
  
  completedOrders: (state) => 
    state.orders?.filter(order => order.status === 'completed') || [],
  
  cancelledOrders: (state) => 
    state.orders?.filter(order => order.status === 'cancelled') || [],
  
  rentalOrders: (state) => 
    state.orders?.filter(order => 
      order.items?.some(item => item.isRental)
    ) || [],
  
  // Get order by ID
  orderById: (id) => (state) => 
    state.orders?.find(order => order.id === id) || null,
  
  // Total spent
  totalSpent: (state) => 
    state.orders?.reduce((total, order) => total + order.totalAmount, 0) || 0,
};