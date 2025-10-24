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
        
        console.log('📊 [Slice] Payment status update:', {
          paymentId,
          status: status.status,
          success: status.success
        });
        
        if (state.currentPayment) {
          // Update the payment status with the full status object
          state.currentPayment.status = status;
          
          const currentStatus = status.status;
          const isSuccess = status.success === true;
          
          // Only mark as success if status is 'paid' AND success is true
          if (currentStatus === 'paid' && isSuccess === true) {
            state.status = 'success';
            state.isPolling = false;
            state.error = null;
            
            // Clear polling interval
            if (state.pollInterval) {
              clearInterval(state.pollInterval);
              state.pollInterval = null;
            }
          } 
          // Mark as failed if status is 'cancelled' or 'failed'
          else if (currentStatus === 'cancelled' || currentStatus === 'failed') {
            state.status = 'failed';
            state.error = status.message || `Payment ${currentStatus}`;
            state.isPolling = false;
            
            // Clear polling interval
            if (state.pollInterval) {
              clearInterval(state.pollInterval);
              state.pollInterval = null;
            }
          }
          // If status is 'sent' or other intermediate states, keep polling
          else {
            state.status = 'processing';
            state.isPolling = true;
            state.error = null;
          }
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