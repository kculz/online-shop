import { createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from './ordersAPI';

export const fetchOrdersThunk = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Fetching orders...');
      const response = await ordersAPI.getOrders();
      console.log('✅ [Thunk] Orders fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Thunk] Failed to fetch orders:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch orders'
      );
    }
  }
);

export const fetchOrderByIdThunk = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Fetching order:', orderId);
      const response = await ordersAPI.getOrder(orderId);
      console.log('✅ [Thunk] Order fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Thunk] Failed to fetch order:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch order'
      );
    }
  }
);

export const createOrderThunk = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('🔄 [Thunk] Creating order:', orderData);
      const response = await ordersAPI.createOrder(orderData);
      console.log('✅ [Thunk] Order created successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Thunk] Failed to create order:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to create order'
      );
    }
  }
);