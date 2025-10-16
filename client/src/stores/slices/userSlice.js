// ============================================
// stores/slices/userSlice.js
// ============================================
import { createUserActions } from '../actions/userActions';

// Initial state
const initialState = {
  profile: null,
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

// User slice
export const userSlice = (set, get) => ({
  // State
  ...initialState,

  // Actions
  ...createUserActions(set, get),
});