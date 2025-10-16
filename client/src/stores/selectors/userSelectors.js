// ============================================
// stores/selectors/userSelectors.js
// ============================================
export const userSelectors = {
  // Select user profile
  profile: (state) => state.profile,
  
  // Select all users (admin)
  users: (state) => state.users,
  
  // Select current user (for admin viewing)
  currentUser: (state) => state.currentUser,
  
  // Select loading state
  isLoading: (state) => state.isLoading,
  
  // Select error
  error: (state) => state.error,
  
  // Derived selectors
  // Get user by ID
  userById: (id) => (state) => 
    state.users?.find(user => user.id === id) || null,
  
  // Admin users only
  adminUsers: (state) => 
    state.users?.filter(user => user.role === 'admin') || [],
  
  // Regular users only
  regularUsers: (state) => 
    state.users?.filter(user => user.role === 'user') || [],
  
  // Active users (recent activity)
  activeUsers: (state) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return state.users?.filter(user => 
      new Date(user.lastLogin) >= thirtyDaysAgo
    ) || [];
  },
  
  // Users with rentals
  usersWithRentals: (state) => 
    state.users?.filter(user => user.rentalCount > 0) || [],
  
  // Users with orders
  usersWithOrders: (state) => 
    state.users?.filter(user => user.orderCount > 0) || [],
  
  // User statistics
  userStats: (state) => ({
    totalUsers: state.users?.length || 0,
    adminCount: state.users?.filter(user => user.role === 'admin').length || 0,
    userCount: state.users?.filter(user => user.role === 'user').length || 0,
    activeCount: state.users?.filter(user => 
      new Date(user.lastLogin) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length || 0,
  }),
};