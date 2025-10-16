// ============================================
// stores/slices/orderSlice.js
// ============================================
import { createOrderActions } from '../actions/orderActions';

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

// Order slice
export const orderSlice = (set, get) => ({
  // State
  ...initialState,

  // Actions
  ...createOrderActions(set, get),
});