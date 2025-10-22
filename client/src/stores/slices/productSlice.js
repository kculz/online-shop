// ============================================
// stores/slices/productSlice.js
// ============================================

import { createProductActions } from "../actions/productAction";
import { createAdminProductActions } from "../actions/adminProductActions";

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

  // Admin Actions
  ...createAdminProductActions(set, get),
});