import { createSlice } from '@reduxjs/toolkit';
import {
  createOrderThunk,
  processEcocashPaymentThunk,
  checkPaymentStatusThunk,
  getPaymentHistoryThunk,
  completeCheckoutThunk,
} from './paymentsThunks';

const initialState = {
  // Current payment process
  currentPayment: null,
  currentOrder: null,
  
  // Payment status
  status: 'idle', // 'idle' | 'processing' | 'success' | 'failed'
  error: null,
  
  // Payment history
  paymentHistory: [],
  historyLoading: false,
  historyError: null,
  
  // Polling
  isPolling: false,
  pollInterval: null
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.historyError = null;
    },
    resetPayment: (state) => {
      state.currentPayment = null;
      state.currentOrder = null;
      state.status = 'idle';
      state.error = null;
      state.isPolling = false;
      
      // Clear polling interval
      if (state.pollInterval) {
        clearInterval(state.pollInterval);
        state.pollInterval = null;
      }
    },
    startPolling: (state, action) => {
      state.isPolling = true;
      state.pollInterval = action.payload;
    },
    stopPolling: (state) => {
      state.isPolling = false;
      if (state.pollInterval) {
        clearInterval(state.pollInterval);
        state.pollInterval = null;
      }
    },
    updatePaymentStatus: (state, action) => {
      if (state.currentPayment) {
        state.currentPayment.status = action.payload.status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Complete Checkout
      .addCase(completeCheckoutThunk.pending, (state) => {
        state.status = 'processing';
        state.error = null;
      })
      .addCase(completeCheckoutThunk.fulfilled, (state, action) => {
        state.status = 'success';
        state.currentOrder = action.payload.order;
        state.currentPayment = action.payload.payment;
        state.error = null;
      })
      .addCase(completeCheckoutThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Create Order
      .addCase(createOrderThunk.pending, (state) => {
        state.status = 'processing';
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Process EcoCash Payment
      .addCase(processEcocashPaymentThunk.pending, (state) => {
        state.status = 'processing';
        state.error = null;
      })
      .addCase(processEcocashPaymentThunk.fulfilled, (state, action) => {
        state.currentPayment = action.payload;
        state.status = 'processing'; // Still processing until payment confirmed
      })
      .addCase(processEcocashPaymentThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Check Payment Status
      .addCase(checkPaymentStatusThunk.pending, (state) => {
        state.isPolling = true;
      })
      .addCase(checkPaymentStatusThunk.fulfilled, (state, action) => {
        const { paymentId, status } = action.payload;
        
        if (state.currentPayment && state.currentPayment.paymentId === paymentId) {
          state.currentPayment.status = status.status;
          
          if (status.status === 'paid') {
            state.status = 'success';
            state.isPolling = false;
          } else if (status.status === 'cancelled') {
            state.status = 'failed';
            state.error = 'Payment was cancelled';
            state.isPolling = false;
          }
          // If pending, continue polling
        }
      })
      .addCase(checkPaymentStatusThunk.rejected, (state, action) => {
        state.isPolling = false;
        state.error = action.payload;
      })
      
      // Get Payment History
      .addCase(getPaymentHistoryThunk.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(getPaymentHistoryThunk.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(getPaymentHistoryThunk.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      });
  },
});

export const {
  clearError,
  resetPayment,
  startPolling,
  stopPolling,
  updatePaymentStatus
} = paymentSlice.actions;

export default paymentSlice.reducer;