// ============================================
// Rental Selectors (features/rental/rentalSelectors.js)
// ============================================

import { createSelector } from 'reselect';
import { rentalUtils } from './rentalsAPI';

const selectRental = (state) => state.rental;

export const selectUserRentals = createSelector(
  [selectRental],
  (rental) => rental.userRentals
);

export const selectAllRentals = createSelector(
  [selectRental],
  (rental) => rental.allRentals
);

export const selectCurrentRental = createSelector(
  [selectRental],
  (rental) => rental.currentRental
);

export const selectOverdueRentals = createSelector(
  [selectRental],
  (rental) => rental.overdueRentals
);

export const selectRentalLoading = createSelector(
  [selectRental],
  (rental) => rental.isLoading
);

export const selectRentalError = createSelector(
  [selectRental],
  (rental) => rental.error
);

export const selectRentalDeleting = createSelector(
  [selectRental],
  (rental) => rental.deletingRental
);

export const selectRentalDeleteError = createSelector(
  [selectRental],
  (rental) => rental.deleteError
);

export const selectRentalsWithCalculatedData = createSelector(
  [selectUserRentals],
  (rentals) => rentals.map(rental => ({
    ...rental,
    status: rentalUtils.calculateStatus(rental),
    days: rentalUtils.calculateDays(rental),
    deletionEligibility: rentalUtils.checkDeletionEligibility(rental),
  }))
);

export const selectAllRentalsWithCalculatedData = createSelector(
  [selectAllRentals],
  (rentals) => rentals.map(rental => ({
    ...rental,
    status: rentalUtils.calculateStatus(rental),
    days: rentalUtils.calculateDays(rental),
    deletionEligibility: rentalUtils.checkDeletionEligibility(rental),
  }))
);

export const selectDeletableRentals = createSelector(
  [selectAllRentalsWithCalculatedData],
  (rentals) => rentals.filter(rental => rental.deletionEligibility.canDelete)
);

export const selectNonDeletableRentals = createSelector(
  [selectAllRentalsWithCalculatedData],
  (rentals) => rentals.filter(rental => !rental.deletionEligibility.canDelete)
);


export const selectActiveRentals = createSelector(
  [selectRentalsWithCalculatedData],
  (rentals) => rentals.filter(rental => rental.status === 'active')
);

export const selectOverdueRentalsList = createSelector(
  [selectRentalsWithCalculatedData],
  (rentals) => rentals.filter(rental => rental.status === 'overdue')
);

export const selectUpcomingRentals = createSelector(
  [selectRentalsWithCalculatedData],
  (rentals) => rentals.filter(rental => rental.status === 'upcoming')
);

export const selectReturnedRentals = createSelector(
  [selectRentalsWithCalculatedData],
  (rentals) => rentals.filter(rental => rental.status === 'returned')
);

export const selectRentalById = (rentalId) =>
  createSelector(
    [selectUserRentals],
    (rentals) => {
      const rental = rentals.find(r => r.id === rentalId);
      if (!rental) return null;
      
      return {
        ...rental,
        status: rentalUtils.calculateStatus(rental),
        days: rentalUtils.calculateDays(rental),
        deletionEligibility: rentalUtils.checkDeletionEligibility(rental),
      };
    }
  );

export const selectRentalsByProductId = (productId) =>
  createSelector(
    [selectUserRentals],
    (rentals) => rentals.filter(rental => 
      rental.items?.some(item => item.productId === productId)
    )
  );

export const selectIsProductCurrentlyRented = (productId) =>
  createSelector(
    [selectActiveRentals],
    (activeRentals) => activeRentals.some(rental =>
      rental.items?.some(item => item.productId === productId)
    )
  );

export const selectRentalStats = createSelector(
  [selectRentalsWithCalculatedData],
  (rentals) => {
    const totalRentals = rentals.length;
    const activeRentals = rentals.filter(r => r.status === 'active').length;
    const overdueRentals = rentals.filter(r => r.status === 'overdue').length;
    const upcomingRentals = rentals.filter(r => r.status === 'upcoming').length;
    const returnedRentals = rentals.filter(r => r.status === 'returned').length;
    const deletableRentals = rentals.filter(r => r.deletionEligibility.canDelete).length;
    
    const totalRevenue = rentals.reduce((sum, rental) => sum + (rental.totalAmount || 0), 0);
    const pendingRevenue = rentals
      .filter(r => !r.isReturned)
      .reduce((sum, rental) => sum + (rental.totalAmount || 0), 0);

    return {
      totalRentals,
      activeRentals,
      overdueRentals,
      upcomingRentals,
      returnedRentals,
      deletableRentals,
      totalRevenue,
      pendingRevenue,
    };
  }
);

export const selectAdminRentalStats = createSelector(
  [selectAllRentalsWithCalculatedData],
  (rentals) => {
    const stats = selectRentalStats({ rental: { userRentals: rentals } });
    const uniqueUsers = new Set(rentals.map(r => r.userId)).size;
    
    return {
      ...stats,
      uniqueUsers,
      averageRevenuePerRental: stats.totalRentals > 0 ? stats.totalRevenue / stats.totalRentals : 0,
    };
  }
);