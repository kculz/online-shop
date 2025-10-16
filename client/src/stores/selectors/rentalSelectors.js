// ============================================
// stores/selectors/rentalSelectors.js
// ============================================
export const rentalSelectors = {
  // Select user rentals
  rentals: (state) => state.rentals,
  
  // Select all rentals (admin)
  allRentals: (state) => state.allRentals,
  
  // Select loading state
  isLoading: (state) => state.isLoading,
  
  // Select error
  error: (state) => state.error,
  
  // Derived selectors
  // Active rentals
  activeRentals: (state) => 
    state.rentals?.filter(rental => rental.status === 'active') || [],
  
  // Overdue rentals
  overdueRentals: (state) => 
    state.rentals?.filter(rental => rental.status === 'overdue') || [],
  
  // Completed rentals
  completedRentals: (state) => 
    state.rentals?.filter(rental => rental.status === 'returned' || rental.status === 'completed') || [],
  
  // Upcoming rentals (starting soon)
  upcomingRentals: (state) => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return state.rentals?.filter(rental => 
      rental.status === 'upcoming' || 
      (rental.status === 'active' && new Date(rental.startDate) > new Date())
    ) || [];
  },
  
  // Current active rentals
  currentRentals: (state) => 
    state.rentals?.filter(rental => 
      rental.status === 'active' && 
      new Date(rental.startDate) <= new Date() && 
      new Date(rental.endDate) >= new Date()
    ) || [],
  
  // Get rental by ID
  rentalById: (id) => (state) => 
    state.rentals?.find(rental => rental.id === id) || null,
  
  // Rentals by product ID
  rentalsByProductId: (productId) => (state) => 
    state.rentals?.filter(rental => rental.orderItem?.productId === productId) || [],
  
  // Total rental revenue
  totalRentalRevenue: (state) => 
    state.rentals?.reduce((total, rental) => total + (rental.orderItem?.price || 0), 0) || 0,
  
  // Rentals ending soon (within 3 days)
  rentalsEndingSoon: (state) => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    return state.rentals?.filter(rental => 
      rental.status === 'active' && 
      new Date(rental.endDate) <= threeDaysFromNow
    ) || [];
  },
};