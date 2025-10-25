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

export const fetchAllOrdersThunk = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 [Admin Thunk] Fetching all orders...');
      const response = await ordersAPI.getAllOrders();
      console.log('✅ [Admin Thunk] All orders fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Admin Thunk] Failed to fetch all orders:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch all orders'
      );
    }
  }
);

// ADMIN: Update order status
export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      console.log('🔄 [Admin Thunk] Updating order status:', { orderId, status });
      const response = await ordersAPI.updateOrderStatus(orderId, status);
      console.log('✅ [Admin Thunk] Order status updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Admin Thunk] Failed to update order status:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update order status'
      );
    }
  }
);

// ADMIN: Delete order
export const deleteOrderThunk = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      console.log('🔄 [Admin Thunk] Deleting order:', orderId);
      await ordersAPI.deleteOrder(orderId);
      console.log('✅ [Admin Thunk] Order deleted successfully');
      return orderId;
    } catch (error) {
      console.error('❌ [Admin Thunk] Failed to delete order:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to delete order'
      );
    }
  }
);

// ADMIN: Get order statistics
export const fetchOrderStatsThunk = createAsyncThunk(
  'orders/fetchOrderStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 [Admin Thunk] Fetching order statistics...');
      const response = await ordersAPI.getOrderStats();
      console.log('✅ [Admin Thunk] Order statistics fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [Admin Thunk] Failed to fetch order statistics:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch order statistics'
      );
    }
  }
);