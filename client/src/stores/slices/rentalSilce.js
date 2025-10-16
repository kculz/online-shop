// ============================================
// stores/slices/rentalSlice.js
// ============================================
import { createRentalActions } from '../actions/rentalActions';

// Initial state
const initialState = {
  rentals: [],
  allRentals: [],
  isLoading: false,
  error: null,
};

// Rental slice
export const rentalSlice = (set, get) => ({
  // State
  ...initialState,

  // Actions
  ...createRentalActions(set, get),
});