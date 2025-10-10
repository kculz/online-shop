// stores/index.js
import { useStore } from './store';

// Direct selector functions
export const useAuthSelectors = () => {
  const state = useStore();
  
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    token: state.token,
    userRole: state.user?.role,
    isAdmin: state.user?.role === 'admin',
  };
};

export const useAuth = () => {
  const state = useStore();
  
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    token: state.token,
    login: state.login,
    logout: state.logout,
    register: state.register,
    checkAuth: state.checkAuth,
    clearError: state.clearError,
    updateProfile: state.updateProfile,
  };
};