import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from './cartAPI';
import { selectCartItems } from './cartSelectors';

export const fetchCartThunk = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isAuthenticated = state.auth.isAuthenticated;
      
      // If user is authenticated, fetch from API
      if (isAuthenticated) {
        const response = await cartAPI.getCart();
        return response.data;
      } else {
        // If not authenticated, return cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          return JSON.parse(savedCart);
        }
        // Return empty cart structure
        return {
          id: 'local-cart',
          userId: null,
          items: []
        };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch cart');
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (itemData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isAuthenticated = state.auth.isAuthenticated;
      
      // Format the data properly
      const formattedData = {
        productId: parseInt(itemData.productId),
        quantity: parseInt(itemData.quantity) || 1,
        isForRental: Boolean(itemData.isForRental),
        rentalDays: itemData.rentalDays || (itemData.isForRental ? 7 : undefined),
        priceAtAddition: parseFloat(itemData.priceAtAddition) || 0,
        productName: itemData.productName,
        productImage: itemData.productImage
      };

      // If authenticated, call API
      if (isAuthenticated) {
        const response = await cartAPI.addItem(formattedData);
        return response.data;
      } else {
        // If not authenticated, return the item data for local storage
        return {
          id: `item-${Date.now()}`,
          ...formattedData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add item to cart');
    }
  }
);

export const updateCartItemThunk = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, updateData }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isAuthenticated = state.auth.isAuthenticated;
      
      if (isAuthenticated) {
        // If authenticated, call API
        const response = await cartAPI.updateItem(itemId, updateData);
        return response.data;
      } else {
        // If not authenticated, return the update data
        return {
          ...updateData,
          id: itemId,
          updatedAt: new Date().toISOString()
        };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update cart item');
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isAuthenticated = state.auth.isAuthenticated;
      
      if (isAuthenticated) {
        // If authenticated, call API
        await cartAPI.removeItem(itemId);
      }
      // For both authenticated and guest users, return the itemId to remove from state
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove item from cart');
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isAuthenticated = state.auth.isAuthenticated;
      
      if (isAuthenticated) {
        await cartAPI.clearCart();
      }
      // For both authenticated and guest users, clear the cart
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clear cart');
    }
  }
);

// Additional utility thunks for common cart operations
export const incrementCartItemThunk = createAsyncThunk(
  'cart/incrementCartItem',
  async (itemId, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const cartItems = selectCartItems(state);
      const cartItem = cartItems.find(item => item.id === itemId);
      
      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      const newQuantity = (cartItem.quantity || 0) + 1;
      
      // Use the update thunk to handle both authenticated and guest scenarios
      const result = await dispatch(updateCartItemThunk({ 
        itemId, 
        updateData: { quantity: newQuantity } 
      })).unwrap();
      
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to increment cart item');
    }
  }
);

export const decrementCartItemThunk = createAsyncThunk(
  'cart/decrementCartItem',
  async (itemId, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const cartItems = selectCartItems(state);
      const cartItem = cartItems.find(item => item.id === itemId);
      
      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      const newQuantity = Math.max((cartItem.quantity || 0) - 1, 1);
      
      // Use the update thunk to handle both authenticated and guest scenarios
      const result = await dispatch(updateCartItemThunk({ 
        itemId, 
        updateData: { quantity: newQuantity } 
      })).unwrap();
      
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to decrement cart item');
    }
  }
);

// Thunk to add or update cart item (useful for product pages)
export const addOrUpdateCartItemThunk = createAsyncThunk(
  'cart/addOrUpdateCartItem',
  async ({ productId, quantity, isForRental }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const existingItem = selectCartItems(state).find(
        item => item.productId === productId && item.isForRental === isForRental
      );

      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + quantity;
        const result = await dispatch(updateCartItemThunk({
          itemId: existingItem.id,
          updateData: { quantity: newQuantity }
        })).unwrap();
        return result;
      } else {
        // Add new item - we need product details here, so this might need adjustment
        const result = await dispatch(addToCartThunk({
          productId,
          quantity,
          isForRental
        })).unwrap();
        return result;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update cart');
    }
  }
);