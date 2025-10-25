// ============================================
// features/rental/rentalSlice.js
// ============================================

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUserRentalsThunk,
  fetchAllRentalsThunk,
  processReturnThunk,
  checkOverdueRentalsThunk,
  createRentalThunk,
  fetchRentalByIdThunk,
  deleteRentalThunk,
  forceDeleteRentalThunk,
} from './rentalsThunks';

const initialState = {
  userRentals: [],
  allRentals: [],
  currentRental: null,
  overdueRentals: [],
  isLoading: false,
  error: null,
  lastFetch: null,
  deletingRental: false,
  deleteError: null,
};

const rentalSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.deleteError = null;
    },
    clearCurrentRental: (state) => {
      state.currentRental = null;
    },
    clearOverdueRentals: (state) => {
      state.overdueRentals = [];
    },
    updateRentalStatus: (state, action) => {
      const { rentalId, updates } = action.payload;
      
      // Update in userRentals
      const userRentalIndex = state.userRentals.findIndex(r => r.id === rentalId);
      if (userRentalIndex !== -1) {
        state.userRentals[userRentalIndex] = {
          ...state.userRentals[userRentalIndex],
          ...updates,
        };
      }
      
      // Update in allRentals
      const allRentalIndex = state.allRentals.findIndex(r => r.id === rentalId);
      if (allRentalIndex !== -1) {
        state.allRentals[allRentalIndex] = {
          ...state.allRentals[allRentalIndex],
          ...updates,
        };
      }
      
      // Update currentRental if it matches
      if (state.currentRental?.id === rentalId) {
        state.currentRental = { ...state.currentRental, ...updates };
      }
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user rentals
      .addCase(fetchUserRentalsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserRentalsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRentals = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchUserRentalsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch all rentals (admin)
      .addCase(fetchAllRentalsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllRentalsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRentals = action.payload;
      })
      .addCase(fetchAllRentalsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Process return
      .addCase(processReturnThunk.fulfilled, (state, action) => {
        const updatedRental = action.payload;
        const rentalId = updatedRental.id;
        
        // Update in userRentals
        const userIndex = state.userRentals.findIndex(r => r.id === rentalId);
        if (userIndex !== -1) {
          state.userRentals[userIndex] = updatedRental;
        }
        
        // Update in allRentals
        const allIndex = state.allRentals.findIndex(r => r.id === rentalId);
        if (allIndex !== -1) {
          state.allRentals[allIndex] = updatedRental;
        }
        
        // Update currentRental if it matches
        if (state.currentRental?.id === rentalId) {
          state.currentRental = updatedRental;
        }
      })
      // Check overdue rentals
      .addCase(checkOverdueRentalsThunk.fulfilled, (state, action) => {
        state.overdueRentals = action.payload;
      })
      // Create rental
      .addCase(createRentalThunk.fulfilled, (state, action) => {
        state.userRentals.unshift(action.payload);
      })
      // Fetch rental by ID
      .addCase(fetchRentalByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRentalByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRental = action.payload;
      })
      .addCase(fetchRentalByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete rental
      .addCase(deleteRentalThunk.pending, (state) => {
        state.deletingRental = true;
        state.deleteError = null;
      })
      .addCase(deleteRentalThunk.fulfilled, (state, action) => {
        state.deletingRental = false;
        const rentalId = action.payload;
        state.userRentals = state.userRentals.filter(r => r.id !== rentalId);
        state.allRentals = state.allRentals.filter(r => r.id !== rentalId);
        if (state.currentRental?.id === rentalId) {
          state.currentRental = null;
        }
      })
      .addCase(deleteRentalThunk.rejected, (state, action) => {
        state.deletingRental = false;
        state.deleteError = action.payload;
      })
      // Force delete rental
      .addCase(forceDeleteRentalThunk.pending, (state) => {
        state.deletingRental = true;
        state.deleteError = null;
      })
      .addCase(forceDeleteRentalThunk.fulfilled, (state, action) => {
        state.deletingRental = false;
        const rentalId = action.payload;
        state.userRentals = state.userRentals.filter(r => r.id !== rentalId);
        state.allRentals = state.allRentals.filter(r => r.id !== rentalId);
        if (state.currentRental?.id === rentalId) {
          state.currentRental = null;
        }
      })
      .addCase(forceDeleteRentalThunk.rejected, (state, action) => {
        state.deletingRental = false;
        state.deleteError = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentRental, 
  clearOverdueRentals, 
  updateRentalStatus,
  clearDeleteError 
} = rentalSlice.actions;
export default rentalSlice.reducer;