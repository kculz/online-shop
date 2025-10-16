// ============================================
// stores/slices/paymentSlice.js
// ============================================
import { createPaymentActions } from '../actions/paymentActions';

// Initial state
const initialState = {
  paymentHistory: [],
  currentPayment: null,
  isLoading: false,
  error: null,
};

// Payment slice
export const paymentSlice = (set, get) => ({
  // State
  ...initialState,

  // Actions
  ...createPaymentActions(set, get),
});