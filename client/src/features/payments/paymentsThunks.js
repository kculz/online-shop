import { createAsyncThunk } from '@reduxjs/toolkit';
import { paymentAPI, paymentUtils } from './paymentsAPI';

export const createOrderThunk = createAsyncThunk(
  'payments/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.createOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create order');
    }
  }
);

export const processEcocashPaymentThunk = createAsyncThunk(
  'payments/processEcocash',
  async (paymentData, { rejectWithValue }) => {
    try {
      // Validate phone number
      const validation = paymentUtils.validateEcocashNumber(paymentData.phoneNumber);
      
      if (!validation.isValid) {
        return rejectWithValue('Please provide a valid EcoCash (Econet) phone number');
      }

      // Format the payment data
      const formattedData = {
        ...paymentData,
        phoneNumber: validation.formatted,
        paymentMethod: 'ecocash'
      };

      const response = await paymentAPI.processEcocashPayment(formattedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to process EcoCash payment');
    }
  }
);

export const checkPaymentStatusThunk = createAsyncThunk(
  'payments/checkStatus',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.checkPaymentStatus(paymentId);
      return {
        paymentId,
        status: response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to check payment status');
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
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch payment history');
    }
  }
);

// Combined thunk for complete checkout process
export const completeCheckoutThunk = createAsyncThunk(
  'payments/completeCheckout',
  async (checkoutData, { rejectWithValue, dispatch }) => {
    try {
      const { orderData, paymentData } = checkoutData;

      // Step 1: Create order
      const orderResult = await dispatch(createOrderThunk(orderData)).unwrap();
      
      if (!orderResult || !orderResult.id) {
        throw new Error('Failed to create order');
      }

      // Step 2: Process payment with order ID
      const paymentResult = await dispatch(processEcocashPaymentThunk({
        ...paymentData,
        orderId: orderResult.id
      })).unwrap();

      return {
        order: orderResult,
        payment: paymentResult
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Checkout process failed');
    }
  }
);