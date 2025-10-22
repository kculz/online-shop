// ============================================
// 4. Cart Slice (features/cart/cartSlice.js)
// ============================================
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCartThunk,
  addToCartThunk,
  updateCartItemThunk,
  removeFromCartThunk,
  clearCartThunk,
} from './cartThunks';

const initialState = {
  cart: null,
  isLoading: false,
  error: null,
  lastFetch: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.cart) {
          const existingItem = state.cart.items.find(
            item => item.productId === action.meta.arg.productId && 
                    item.isForRental === action.meta.arg.isForRental
          );
          
          if (existingItem) {
            existingItem.quantity += action.meta.arg.quantity;
          } else {
            state.cart.items.push(action.payload);
          }
        }
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        if (state.cart) {
          const index = state.cart.items.findIndex(item => item.id === action.meta.arg.itemId);
          if (index !== -1) {
            state.cart.items[index] = { ...state.cart.items[index], ...action.payload };
          }
        }
      })
      // Remove from cart
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.items = state.cart.items.filter(item => item.id !== action.payload);
        }
      })
      // Clear cart
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.cart = null;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;