// ============================================
// stores/actions/rentalActions.js
// ============================================
import { rentalsAPI } from '../../services/api';

export const createRentalActions = (set, get) => ({
  // Fetch user rentals
  fetchUserRentals: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await rentalsAPI.getUserRentals();
      const rentals = response.data;
      
      set({
        rentals,
        isLoading: false,
        error: null,
      });
      
      return { success: true, rentals };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch rentals';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Fetch all rentals (admin only)
  fetchAllRentals: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await rentalsAPI.getAllRentals();
      const allRentals = response.data;
      
      set({
        allRentals,
        isLoading: false,
        error: null,
      });
      
      return { success: true, rentals: allRentals };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch all rentals';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Process rental return (admin only)
  processRentalReturn: async (rentalId, returnData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await rentalsAPI.processReturn(rentalId, returnData);
      const result = response.data;
      
      // Refresh rentals after return
      await get().fetchUserRentals();
      
      return { success: true, result };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to process rental return';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Check for overdue rentals (admin only)
  checkOverdueRentals: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await rentalsAPI.checkOverdue();
      const result = response.data;
      
      set({ isLoading: false });
      
      return { success: true, result };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to check overdue rentals';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Extend rental period
  extendRental: async (rentalId, extraDays) => {
    try {
      set({ isLoading: true, error: null });
      
      // This would be a custom API endpoint
      // const response = await rentalsAPI.extendRental(rentalId, extraDays);
      // const updatedRental = response.data;
      
      // For now, we'll simulate this action
      const { rentals } = get();
      const rentalIndex = rentals.findIndex(rental => rental.id === rentalId);
      
      if (rentalIndex !== -1) {
        const updatedRental = {
          ...rentals[rentalIndex],
          endDate: new Date(new Date(rentals[rentalIndex].endDate).getTime() + extraDays * 24 * 60 * 60 * 1000),
          extended: true,
        };
        
        const updatedRentals = [...rentals];
        updatedRentals[rentalIndex] = updatedRental;
        
        set({
          rentals: updatedRentals,
          isLoading: false,
          error: null,
        });
        
        return { success: true, rental: updatedRental };
      }
      
      throw new Error('Rental not found');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to extend rental';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
});