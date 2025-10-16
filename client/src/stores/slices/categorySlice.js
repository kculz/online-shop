// ============================================
// stores/slices/categorySlice.js
// ============================================
import { createCategoryActions } from '../actions/categoryActions';

// Initial state
const initialState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

// Category slice
export const categorySlice = (set, get) => ({
  // State
  ...initialState,

  // Actions
  ...createCategoryActions(set, get),
});