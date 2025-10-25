import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOrdersThunk,
  fetchOrderByIdThunk,
  createOrderThunk,
  updateOrderStatusThunk,
} from './ordersThunks';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  creating: false,
  createError: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Order by ID
      .addCase(fetchOrderByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.updatingStatus = true;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.updatingStatus = false;
        // Update the order in the list
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        // Update current order if it's the one being updated
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.updatingStatus = false;
        state.error = action.payload;
      })
      
      // Create Order
      .addCase(createOrderThunk.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.creating = false;
        state.currentOrder = action.payload;
        // Add to orders list
        state.orders.unshift(action.payload);
        state.createError = null;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });
  },
});

export const { clearError, clearCurrentOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;