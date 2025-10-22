// ============================================
// Categories Thunks (features/categories/categoriesThunks.js)
// ============================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import { categoriesAPI, categoryUtils } from './categoriesAPI';

export const fetchCategoriesThunk = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoryByIdThunk = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getCategoryById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch category');
    }
  }
);

export const createCategoryThunk = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const formattedData = categoryUtils.formatForAPI(categoryData);
      const response = await categoriesAPI.createCategory(formattedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create category');
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const formattedData = categoryUtils.formatForAPI(categoryData);
      const response = await categoriesAPI.updateCategory(id, formattedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update category');
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await categoriesAPI.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete category');
    }
  }
);

export const toggleCategoryStatusThunk = createAsyncThunk(
  'categories/toggleCategoryStatus',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const category = selectCategoryById(state, id);
      
      if (!category) {
        throw new Error('Category not found');
      }

      const response = await categoriesAPI.updateCategory(id, { 
        isActive: !category.isActive 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to toggle category status');
    }
  }
);

// Import selector for use in thunks
import { selectCategoryById } from './categoriesSelectors';