import { authAPI } from '../../services/api'; // You'll need to create this

export const createAuthActions = (set, get) => ({
  // Login action
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authAPI.login(credentials);
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
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
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

  // Logout action
  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  // Register action
  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authAPI.register(userData);
      const { user, token } = response.data;
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      localStorage.setItem('token', token);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Check authentication status (on app load)
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { isAuthenticated: false };
    }
    
    try {
      set({ isLoading: true });
      
      // Verify token with backend
      const response = await authAPI.verifyToken(token);
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

  // Update user profile
  updateProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authAPI.updateProfile(userData, get().token);
      const { user } = response.data;
      
      set({
        user,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },
});