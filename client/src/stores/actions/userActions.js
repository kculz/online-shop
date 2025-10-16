// ============================================
// stores/actions/userActions.js
// ============================================
import { usersAPI } from '../../services/api';

export const createUserActions = (set, get) => ({
  // Fetch user profile
  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersAPI.getProfile();
      const profile = response.data;
      
      set({
        profile,
        isLoading: false,
        error: null,
      });
      
      return { success: true, profile };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch profile';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersAPI.updateProfile(userData);
      const updatedProfile = response.data;
      
      set({
        profile: updatedProfile,
        isLoading: false,
        error: null,
      });
      
      return { success: true, profile: updatedProfile };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Fetch all users (admin only)
  fetchAllUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersAPI.getAllUsers();
      const users = response.data;
      
      set({
        users,
        isLoading: false,
        error: null,
      });
      
      return { success: true, users };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch users';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Fetch user by ID (admin or own profile)
  fetchUserById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersAPI.getUserById(id);
      const user = response.data;
      
      set({
        currentUser: user,
        isLoading: false,
        error: null,
      });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch user';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Update user (admin or own profile)
  updateUser: async (id, userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await usersAPI.updateUser(id, userData);
      const updatedUser = response.data;
      
      // Update in local state if it's the current user
      const { profile } = get();
      if (profile && profile.id === id) {
        set({ profile: updatedUser });
      }
      
      // Update in users list if it exists
      const { users } = get();
      if (users) {
        const updatedUsers = users.map(user => 
          user.id === id ? updatedUser : user
        );
        set({ users: updatedUsers });
      }
      
      set({ isLoading: false, error: null });
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update user';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Delete user (admin or own profile)
  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      await usersAPI.deleteUser(id);
      
      // Remove from local state
      const { users } = get();
      if (users) {
        const filteredUsers = users.filter(user => user.id !== id);
        set({ users: filteredUsers });
      }
      
      set({ isLoading: false, error: null });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete user';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Clear current user
  clearCurrentUser: () => set({ currentUser: null }),

  // Clear error
  clearError: () => set({ error: null }),
});