// ============================================
// 1. Products Slice (features/products/productsSlice.js)
// ============================================
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProductsThunk,
  fetchProductByIdThunk,
  fetchRentalProductsThunk,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk,
  toggleAvailabilityThunk,
} from './productsThunks';

const initialState = {
  products: [],
  rentalProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch product by ID
      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch rental products
      .addCase(fetchRentalProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRentalProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rentalProducts = action.payload;
      })
      .addCase(fetchRentalProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create product (admin)
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      // Update product (admin)
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      // Delete product (admin)
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      })
      // Toggle availability
      .addCase(toggleAvailabilityThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;