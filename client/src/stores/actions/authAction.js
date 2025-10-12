// ============================================
// stores/actions/authAction.js
// ============================================
import { authAPI } from '../../services/api';

export const createAuthActions = (set, get) => ({
  // Sign in action
  signin: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authAPI.signin(credentials);
      const { user, token } = response.data;
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      // Store token in localStorage for persistence
      localStorage.setItem('token', token);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Invalid credentials';
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
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      localStorage.setItem('token', token);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Registration failed';
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
        error: null,
      });
    }
  },

  // Check authentication status (on app load)
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ isLoading: false });
      return { isAuthenticated: false };
    }
    
    try {
      set({ isLoading: true });
      
      // Verify token with backend
      const response = await authAPI.verifyToken();
      const { user } = response.data;
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { isAuthenticated: true };
    } catch (error) {
      // Token is invalid, clear it
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
