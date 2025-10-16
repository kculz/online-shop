// ============================================
// stores/slices/cartSlice.js
// ============================================
import { createCartActions } from '../actions/cartActions';

// Initial state
const initialState = {
  cart: null,
  isLoading: false,
  error: null,
};

// Cart slice
export const cartSlice = (set, get) => ({
  // State
  ...initialState,

  // Actions
  ...createCartActions(set, get),
});