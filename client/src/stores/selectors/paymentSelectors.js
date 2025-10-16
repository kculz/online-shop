// ============================================
// stores/selectors/paymentSelectors.js
// ============================================
export const paymentSelectors = {
  // Select payment history
  paymentHistory: (state) => state.paymentHistory,
  
  // Select current payment
  currentPayment: (state) => state.currentPayment,
  
  // Select loading state
  isLoading: (state) => state.isLoading,
  
  // Select error
  error: (state) => state.error,
  
  // Derived selectors
  // Successful payments
  successfulPayments: (state) => 
    state.paymentHistory?.filter(payment => payment.status === 'paid') || [],
  
  // Pending payments
  pendingPayments: (state) => 
    state.paymentHistory?.filter(payment => payment.status === 'pending') || [],
  
  // Failed payments
  failedPayments: (state) => 
    state.paymentHistory?.filter(payment => payment.status === 'failed' || payment.status === 'cancelled') || [],
  
  // Recent payments (last 30 days)
  recentPayments: (state) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return state.paymentHistory?.filter(payment => 
      new Date(payment.createdAt) >= thirtyDaysAgo
    ) || [];
  },
  
  // Total amount paid
  totalPaid: (state) => 
    state.paymentHistory
      ?.filter(payment => payment.status === 'paid')
      .reduce((total, payment) => total + payment.amount, 0) || 0,
  
  // Get payment by ID
  paymentById: (id) => (state) => 
    state.paymentHistory?.find(payment => payment.id === id) || null,
  
  // Get payments by order ID
  paymentsByOrderId: (orderId) => (state) => 
    state.paymentHistory?.filter(payment => payment.orderId === orderId) || [],
  
  // EcoCash payments only
  ecocashPayments: (state) => 
    state.paymentHistory?.filter(payment => payment.paymentMethod === 'ecocash') || [],
};