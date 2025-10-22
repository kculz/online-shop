// ============================================
// 2. Products Thunks (features/products/productsThunks.js)
// ============================================
import { createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from './productsAPI';

export const fetchProductsThunk = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const fetchProductByIdThunk = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch product');
    }
  }
);

export const fetchRentalProductsThunk = createAsyncThunk(
  'products/fetchRentalProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getRentalProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch rental products');
    }
  }
);

export const createProductThunk = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productsAPI.create(productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create product');
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.update(id, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update product');
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete product');
    }
  }
);

export const toggleAvailabilityThunk = createAsyncThunk(
  'products/toggleAvailability',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productsAPI.toggleAvailability(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to toggle availability');
    }
  }
);