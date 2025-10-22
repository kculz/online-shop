// ============================================
// stores/actions/authActions.js
// ============================================
import { authAPI } from '../../services/api';

export const createAuthActions = (set, get) => ({
  // Sign in action
  signin: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authAPI.signin(credentials);
      const { user, token } = response.data;
      
      // Store token in localStorage for persistence
      localStorage.setItem('token', token);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Invalid credentials';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        user: null,
        token: null,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Sign up action
  signup: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authAPI.signup(userData);
      const { user, token } = response.data;
      
      // Store token in localStorage for persistence
      localStorage.setItem('token', token);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Logout action
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // Check authentication status (on app load)
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    // ✅ FIX: If no token, set state only once and return early
    if (!token) {
      set({ 
        isAuthenticated: false, 
        isLoading: false,
        user: null,
        token: null,
        error: null
      });
      return { isAuthenticated: false };
    }
    
    try {
      // ✅ FIX: Only set loading to true if we're actually checking
      set({ isLoading: true, error: null });
      
      // Verify token with backend
      const response = await authAPI.verifyToken();
      const { user } = response.data;
      
      // ✅ FIX: Set all state at once to avoid multiple renders
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { isAuthenticated: true, user };
    } catch (error) {
      // ✅ FIX: Token is invalid, clear everything at once
      localStorage.removeItem('token');
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      return { isAuthenticated: false };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
});