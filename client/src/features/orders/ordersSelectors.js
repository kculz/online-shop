// features/orders/ordersSelectors.js
import { createSelector } from 'reselect';

const selectOrders = (state) => state.orders;

export const selectAllOrders = createSelector(
  [selectOrders],
  (orders) => orders.orders
);

export const selectCurrentOrder = createSelector(
  [selectOrders],
  (orders) => orders.currentOrder
);

export const selectOrdersLoading = createSelector(
  [selectOrders],
  (orders) => orders.loading
);

export const selectOrdersError = createSelector(
  [selectOrders],
  (orders) => orders.error
);

export const selectOrderCreating = createSelector(
  [selectOrders],
  (orders) => orders.creating
);

export const selectOrderCreateError = createSelector(
  [selectOrders],
  (orders) => orders.createError
);

// ADD THIS MISSING SELECTOR
export const selectOrderStatusUpdating = createSelector(
  [selectOrders],
  (orders) => orders.updatingStatus || false
);

export const selectPendingOrders = createSelector(
  [selectAllOrders],
  (orders) => orders.filter(order => 
    ['pending', 'payment_pending', 'processing'].includes(order.status)
  )
);

export const selectCompletedOrders = createSelector(
  [selectAllOrders],
  (orders) => orders.filter(order => 
    ['confirmed', 'shipped', 'delivered'].includes(order.status)
  )
);

export const selectCancelledOrders = createSelector(
  [selectAllOrders],
  (orders) => orders.filter(order => order.status === 'cancelled')
);

export const selectOrdersByStatus = createSelector(
  [selectAllOrders],
  (orders) => {
    const grouped = {
      pending: [],
      processing: [],
      confirmed: [],
      shipped: [],
      delivered: [],
      cancelled: []
    };
    
    orders.forEach(order => {
      if (grouped[order.status]) {
        grouped[order.status].push(order);
      }
    });
    
    return grouped;
  }
);

export const selectOrderStats = createSelector(
  [selectAllOrders],
  (orders) => {
    const total = orders.length;
    const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);
    const pending = orders.filter(order => ['pending', 'payment_pending'].includes(order.status)).length;
    const completed = orders.filter(order => ['confirmed', 'shipped', 'delivered'].includes(order.status)).length;
    
    return {
      total,
      totalAmount: totalAmount.toFixed(2),
      pending,
      completed,
      cancelled: orders.filter(order => order.status === 'cancelled').length
    };
  }
);