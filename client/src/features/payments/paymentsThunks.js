// features/payments/paymentsThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { paymentAPI, paymentUtils } from './paymentsAPI';

export const createOrderThunk = createAsyncThunk(
  'payments/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Creating order with data:', orderData);
      const response = await paymentAPI.createOrder(orderData);
      return response.data;
    } catch (error) {
      console.error('❌ [Thunk] Order creation failed:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || 'Failed to create order'
      );
    }
  }
);

export const processEcocashPaymentThunk = createAsyncThunk(
  'payments/processEcocash',
  async (paymentData, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Processing EcoCash payment:', paymentData);
      
      // Validate phone number
      const validation = paymentUtils.validateEcocashNumber(paymentData.phoneNumber);
      console.log('📱 [Thunk] Phone validation:', validation);
      
      if (!validation.isValid) {
        return rejectWithValue('Please provide a valid EcoCash (Econet) phone number');
      }

      // Format the payment data
      const formattedData = {
        orderId: paymentData.orderId,
        phoneNumber: validation.formatted
        // Remove amount - backend gets it from order
      };

      console.log('📤 [Thunk] Sending payment data:', formattedData);
      const response = await paymentAPI.processEcocashPayment(formattedData);
      return response.data;
    } catch (error) {
      console.error('❌ [Thunk] EcoCash payment failed:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || 'Failed to process EcoCash payment'
      );
    }
  }
);

export const checkPaymentStatusThunk = createAsyncThunk(
  'payments/checkStatus',
  async (paymentId, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Checking payment status for:', paymentId);
      const response = await paymentAPI.checkPaymentStatus(paymentId);
      return {
        paymentId,
        status: response.data
      };
    } catch (error) {
      console.error('❌ [Thunk] Payment status check failed:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to check payment status'
      );
    }
  }
);

export const getPaymentHistoryThunk = createAsyncThunk(
  'payments/getHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPaymentHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch payment history'
      );
    }
  }
);

// Combined thunk for complete checkout process
export const completeCheckoutThunk = createAsyncThunk(
  'payments/completeCheckout',
  async (checkoutData, { rejectWithValue, dispatch }) => {
    try {
      console.log('🔄 [Thunk] Starting complete checkout process...');
      const { orderData, paymentData } = checkoutData;

      // Step 1: Create order
      console.log('📦 [Thunk] Step 1: Creating order...');
      const orderResult = await dispatch(createOrderThunk(orderData)).unwrap();
      
      console.log('✅ [Thunk] Order created:', orderResult);
      
      if (!orderResult || !orderResult.id) {
        throw new Error('Failed to create order - no order ID returned');
      }

      // Step 2: Process payment with order ID
      console.log('💰 [Thunk] Step 2: Processing payment...');
      const paymentResult = await dispatch(processEcocashPaymentThunk({
        orderId: orderResult.id,
        phoneNumber: paymentData.phoneNumber
      })).unwrap();

      console.log('✅ [Thunk] Payment processed:', paymentResult);

      return {
        order: orderResult,
        payment: paymentResult
      };
    } catch (error) {
      console.error('❌ [Thunk] Complete checkout failed:', error);
      return rejectWithValue(
        error.payload || error.message || 'Checkout process failed'
      );
    }
  }
);