import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCartThunk,
  addToCartThunk,
  updateCartItemThunk,
  removeFromCartThunk,
  clearCartThunk,
} from './cartThunks';

// Helper to get initial state from localStorage
const getInitialState = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      const parsedCart = JSON.parse(savedCart);
      return {
        cart: parsedCart,
        isLoading: false,
        error: null,
        lastFetch: null,
      };
    } catch (error) {
      console.error('Error parsing saved cart:', error);
    }
  }
  
  return {
    cart: {
      id: 'local-cart',
      userId: null,
      items: []
    },
    isLoading: false,
    error: null,
    lastFetch: null,
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Sync with localStorage
    syncCartWithLocalStorage: (state) => {
      if (state.cart && state.cart.items.length > 0) {
        localStorage.setItem('cart', JSON.stringify(state.cart));
      } else {
        localStorage.removeItem('cart');
      }
    },
    // Initialize cart from localStorage
    initializeCartFromStorage: (state) => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          state.cart = JSON.parse(savedCart);
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          state.cart = {
            id: 'local-cart',
            userId: null,
            items: []
          };
        }
      }
    },
    // Direct quantity update (for immediate UI response)
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      if (state.cart && state.cart.items) {
        const item = state.cart.items.find(item => item.id === itemId);
        if (item) {
          item.quantity = quantity;
          localStorage.setItem('cart', JSON.stringify(state.cart));
        }
      }
    },
    // Direct item removal (for immediate UI response)
    removeItem: (state, action) => {
      const itemId = action.payload;
      if (state.cart && state.cart.items) {
        state.cart.items = state.cart.items.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
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
        // Sync to localStorage
        if (action.payload && action.payload.items && action.payload.items.length > 0) {
          localStorage.setItem('cart', JSON.stringify(action.payload));
        }
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
        
        // Ensure cart exists
        if (!state.cart) {
          state.cart = {
            id: `cart-${Date.now()}`,
            userId: null,
            items: []
          };
        }

        // Ensure items array exists
        if (!state.cart.items) {
          state.cart.items = [];
        }

        const newItem = action.payload;
        const existingItemIndex = state.cart.items.findIndex(
          item => item.productId === newItem.productId && 
                  item.isForRental === newItem.isForRental
        );
        
        if (existingItemIndex !== -1) {
          // Update existing item quantity
          state.cart.items[existingItemIndex].quantity += newItem.quantity || 1;
        } else {
          // Add new item with complete structure
          const completeItem = {
            id: newItem.id || `item-${Date.now()}`,
            productId: newItem.productId,
            quantity: newItem.quantity || 1,
            isForRental: newItem.isForRental || false,
            priceAtAddition: newItem.priceAtAddition || 0,
            productName: newItem.productName || 'Product',
            productImage: newItem.productImage || '📦',
            rentalDays: newItem.rentalDays,
            createdAt: newItem.createdAt || new Date().toISOString(),
            updatedAt: newItem.updatedAt || new Date().toISOString()
          };
          state.cart.items.push(completeItem);
        }

        // Sync to localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update cart item - FIXED VERSION
      .addCase(updateCartItemThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (state.cart && state.cart.items) {
          const { itemId, updateData } = action.meta.arg;
          const updatedItem = action.payload;
          
          const index = state.cart.items.findIndex(item => item.id === itemId);
          
          if (index !== -1) {
            // Merge the updated fields
            state.cart.items[index] = {
              ...state.cart.items[index],
              ...updatedItem,
              quantity: updateData.quantity !== undefined ? updateData.quantity : state.cart.items[index].quantity,
              updatedAt: new Date().toISOString()
            };
            
            // Sync to localStorage
            localStorage.setItem('cart', JSON.stringify(state.cart));
          }
        }
      })
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCartThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.cart && state.cart.items) {
          state.cart.items = state.cart.items.filter(item => item.id !== action.payload);
          localStorage.setItem('cart', JSON.stringify(state.cart));
        }
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Clear cart
      .addCase(clearCartThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.cart = {
          id: 'local-cart',
          userId: null,
          items: []
        };
        localStorage.removeItem('cart');
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  syncCartWithLocalStorage, 
  initializeCartFromStorage,
  updateQuantity,
  removeItem 
} = cartSlice.actions;
export default cartSlice.reducer;