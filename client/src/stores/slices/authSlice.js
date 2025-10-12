// ============================================
// stores/slices/authSlice.js
// ============================================
import { createAuthActions } from '../actions/authAction';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth slice
export const authSlice = (set, get) => ({
  // State
  ...initialState,

  // Actions
  ...createAuthActions(set, get),
});
