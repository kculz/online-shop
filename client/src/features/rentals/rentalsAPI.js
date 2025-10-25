// ============================================
// features/rental/rentalsAPI.js
// ============================================

import axiosInstance from '../../services/api';

export const rentalAPI = {
  /**
   * Get user's rentals
   * @returns {Promise<AxiosResponse>} - API response containing user's rentals
   */
  getUserRentals: () => {
    return axiosInstance.get('/rentals');
  },

  /**
   * Get all rentals (admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise<AxiosResponse>} - API response containing all rentals
   */
  getAllRentals: (params = {}) => {
    return axiosInstance.get('/rentals/all', { params });
  },

  /**
   * Process rental return (admin only)
   * @param {string|number} rentalId - Rental ID
   * @param {Object} returnData - Return data (condition, notes, etc.)
   * @returns {Promise<AxiosResponse>} - API response containing updated rental
   */
  processReturn: (rentalId, returnData = {}) => {
    return axiosInstance.post(`/rentals/${rentalId}/return`, returnData);
  },

  /**
   * Check for overdue rentals (admin only)
   * @returns {Promise<AxiosResponse>} - API response containing overdue rentals
   */
  checkOverdueRentals: () => {
    return axiosInstance.get('/rentals/overdue/check');
  },

  /**
   * Create new rental (from cart checkout)
   * @param {Object} rentalData - Rental data
   * @returns {Promise<AxiosResponse>} - API response containing created rental
   */
  createRental: (rentalData) => {
    return axiosInstance.post('/rentals', rentalData);
  },

  /**
   * Get rental by ID
   * @param {string|number} rentalId - Rental ID
   * @returns {Promise<AxiosResponse>} - API response containing rental data
   */
  getRentalById: (rentalId) => {
    return axiosInstance.get(`/rentals/${rentalId}`);
  },

  /**
   * Delete rental (admin only)
   * @param {string|number} rentalId - Rental ID
   * @returns {Promise<AxiosResponse>} - API response
   */
  deleteRental: (rentalId) => {
    return axiosInstance.delete(`/rentals/${rentalId}`);
  },

  /**
   * Force delete rental (admin only - any status)
   * @param {string|number} rentalId - Rental ID
   * @returns {Promise<AxiosResponse>} - API response
   */
  forceDeleteRental: (rentalId) => {
    return axiosInstance.delete(`/rentals/${rentalId}/force`);
  },
};

// Utility functions for rental data transformation
export const rentalUtils = {
  /**
   * Format rental data for API submission
   * @param {Object} rentalData - Raw rental data
   * @returns {Object} - Formatted rental data for API
   */
  formatForAPI: (rentalData) => {
    const formatted = { ...rentalData };
    
    // Convert dates to ISO string
    if (formatted.startDate && formatted.startDate instanceof Date) {
      formatted.startDate = formatted.startDate.toISOString();
    }
    
    if (formatted.endDate && formatted.endDate instanceof Date) {
      formatted.endDate = formatted.endDate.toISOString();
    }
    
    // Ensure boolean fields are properly formatted
    const booleanFields = ['isReturned', 'isOverdue'];
    booleanFields.forEach(field => {
      if (field in formatted) {
        formatted[field] = Boolean(formatted[field]);
      }
    });

    return formatted;
  },

  /**
   * Calculate rental status
   * @param {Object} rental - Rental object
   * @returns {string} - Status string
   */
  calculateStatus: (rental) => {
    if (rental.isReturned) return 'returned';
    
    const now = new Date();
    const endDate = new Date(rental.endDate);
    
    if (now > endDate) return 'overdue';
    if (now >= new Date(rental.startDate)) return 'active';
    
    return 'upcoming';
  },

  /**
   * Calculate total days and overdue days
   * @param {Object} rental - Rental object
   * @returns {Object} - Days calculation
   */
  calculateDays: (rental) => {
    const start = new Date(rental.startDate);
    const end = new Date(rental.endDate);
    const now = new Date();
    
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const daysUsed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    const overdueDays = now > end ? Math.ceil((now - end) / (1000 * 60 * 60 * 24)) : 0;
    
    return {
      totalDays,
      daysUsed: Math.max(0, daysUsed),
      daysRemaining: Math.max(0, daysRemaining),
      overdueDays,
    };
  },

  /**
   * Check if rental can be deleted
   * @param {Object} rental - Rental object
   * @returns {Object} - Deletion eligibility
   */
  checkDeletionEligibility: (rental) => {
    const canDelete = ['returned', 'cancelled', 'upcoming'].includes(rental.status);
    const message = canDelete 
      ? 'Rental can be deleted' 
      : `Cannot delete ${rental.status} rental. Only returned, cancelled, or upcoming rentals can be deleted.`;

    return {
      canDelete,
      message,
      requiresForceDelete: !canDelete
    };
  }
};