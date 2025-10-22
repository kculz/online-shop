// ============================================
// Rental Thunks (features/rental/rentalThunks.js)
// ============================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import { rentalAPI, rentalUtils } from './rentalsAPI';

export const fetchUserRentalsThunk = createAsyncThunk(
  'rental/fetchUserRentals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await rentalAPI.getUserRentals();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user rentals');
    }
  }
);

export const fetchAllRentalsThunk = createAsyncThunk(
  'rental/fetchAllRentals',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await rentalAPI.getAllRentals(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch all rentals');
    }
  }
);

export const processReturnThunk = createAsyncThunk(
  'rental/processReturn',
  async ({ rentalId, returnData = {} }, { rejectWithValue }) => {
    try {
      const response = await rentalAPI.processReturn(rentalId, returnData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to process return');
    }
  }
);

export const checkOverdueRentalsThunk = createAsyncThunk(
  'rental/checkOverdueRentals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await rentalAPI.checkOverdueRentals();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to check overdue rentals');
    }
  }
);

export const createRentalThunk = createAsyncThunk(
  'rental/createRental',
  async (rentalData, { rejectWithValue }) => {
    try {
      const formattedData = rentalUtils.formatForAPI(rentalData);
      const response = await rentalAPI.createRental(formattedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create rental');
    }
  }
);

export const fetchRentalByIdThunk = createAsyncThunk(
  'rental/fetchRentalById',
  async (rentalId, { rejectWithValue }) => {
    try {
      const response = await rentalAPI.getRentalById(rentalId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch rental');
    }
  }
);