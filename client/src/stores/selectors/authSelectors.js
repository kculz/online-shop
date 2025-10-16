// ============================================
// stores/selectors/authSelectors.js
// ============================================
export const authSelectors = {
  // Select user
  user: (state) => state.user,
  
  // Select authentication status
  isAuthenticated: (state) => state.isAuthenticated,
  
  // Select loading state
  isLoading: (state) => state.isLoading,
  
  // Select error
  error: (state) => state.error,
  
  // Select token
  token: (state) => state.token,
  
  // Select user role
  userRole: (state) => state.user?.role,
  
  // Check if user is admin
  isAdmin: (state) => state.user?.role === 'admin',
  
  // Get user email
  userEmail: (state) => state.user?.email,
  
  // Get username
  username: (state) => state.user?.username,
  
  // Get user ID
  userId: (state) => state.user?.id,
};