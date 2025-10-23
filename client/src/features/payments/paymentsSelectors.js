import { createSelector } from 'reselect';

const selectPayments = (state) => state.payments;

export const selectPaymentStatus = createSelector(
  [selectPayments],
  (payments) => payments.status
);

export const selectPaymentError = createSelector(
  [selectPayments],
  (payments) => payments.error
);

export const selectCurrentPayment = createSelector(
  [selectPayments],
  (payments) => payments.currentPayment
);

export const selectCurrentOrder = createSelector(
  [selectPayments],
  (payments) => payments.currentOrder
);

export const selectIsProcessing = createSelector(
  [selectPayments],
  (payments) => payments.status === 'processing'
);

export const selectIsPaymentSuccess = createSelector(
  [selectPayments],
  (payments) => payments.status === 'success'
);

export const selectIsPaymentFailed = createSelector(
  [selectPayments],
  (payments) => payments.status === 'failed'
);

export const selectIsPolling = createSelector(
  [selectPayments],
  (payments) => payments.isPolling
);

export const selectPaymentHistory = createSelector(
  [selectPayments],
  (payments) => payments.paymentHistory
);

export const selectHistoryLoading = createSelector(
  [selectPayments],
  (payments) => payments.historyLoading
);

export const selectHistoryError = createSelector(
  [selectPayments],
  (payments) => payments.historyError
);

export const selectCanCheckout = createSelector(
  [selectPayments],
  (payments) => payments.status === 'idle' || payments.status === 'failed'
);

// Get payment status for display
export const selectPaymentStatusDisplay = createSelector(
  [selectCurrentPayment, selectPaymentStatus],
  (payment, status) => {
    if (status === 'success') return 'Payment Successful';
    if (status === 'failed') return 'Payment Failed';
    if (status === 'processing' && payment) {
      return 'Awaiting Payment Confirmation';
    }
    return 'Ready for Payment';
  }
);