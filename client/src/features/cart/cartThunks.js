// ============================================
// Cart Thunks (features/cart/cartThunks.js)
// ============================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from './cartAPI';

export const fetchCartThunk = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch cart');
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { rejectWithValue }) => {
    try {
      const formattedData = cartUtils.formatForAPI(itemData);
      const response = await cartAPI.addItem(formattedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add item to cart');
    }
  }
);

export const updateCartItemThunk = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, updateData }, { rejectWithValue }) => {
    try {
      const formattedData = cartUtils.formatForAPI(updateData);
      const response = await cartAPI.updateItem(itemId, formattedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update cart item');
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await cartAPI.removeItem(itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove item from cart');
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clear cart');
    }
  }
);

// Additional utility thunks for common cart operations
export const incrementCartItemThunk = createAsyncThunk(
  'cart/incrementCartItem',
  async (itemId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const cartItem = selectCartItems(state).find(item => item.id === itemId);
      
      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      const newQuantity = cartItem.quantity + 1;
      const response = await cartAPI.updateItem(itemId, { quantity: newQuantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to increment cart item');
    }
  }
);

export const decrementCartItemThunk = createAsyncThunk(
  'cart/decrementCartItem',
  async (itemId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const cartItem = selectCartItems(state).find(item => item.id === itemId);
      
      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      const newQuantity = cartItem.quantity - 1;
      
      if (newQuantity <= 0) {
        // Remove item if quantity becomes 0
        await cartAPI.removeItem(itemId);
        return itemId;
      } else {
        const response = await cartAPI.updateItem(itemId, { quantity: newQuantity });
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to decrement cart item');
    }
  }
);

// Thunk to add or update cart item (useful for product pages)
export const addOrUpdateCartItemThunk = createAsyncThunk(
  'cart/addOrUpdateCartItem',
  async ({ productId, quantity, isForRental }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const existingItem = selectCartItems(state).find(
        item => item.productId === productId && item.isForRental === isForRental
      );

      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + quantity;
        const response = await cartAPI.updateItem(existingItem.id, { quantity: newQuantity });
        return response.data;
      } else {
        // Add new item
        const response = await cartAPI.addItem({ productId, quantity, isForRental });
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update cart');
    }
  }
);

// Import selector for use in thunks (add this import at the top)
import { selectCartItems } from './cartSelectors';