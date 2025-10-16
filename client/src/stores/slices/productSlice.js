// ============================================
// stores/slices/productSlice.js
// ============================================

import { createProductActions } from "../actions/productAction";

// Initial state
const initialState = {
  products: [],
  rentalProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

// Product slice
export const productSlice = (set, get) => ({
  // State
  ...initialState,

  // Actions
  ...createProductActions(set, get),
});