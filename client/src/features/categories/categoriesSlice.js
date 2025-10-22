// ============================================
// Categories Slice (features/categories/categoriesSlice.js)
// ============================================

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCategoriesThunk,
  fetchCategoryByIdThunk,
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
  toggleCategoryStatusThunk,
} from './categoriesThunks';

const initialState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
  lastFetch: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      if (state.currentCategory?.id === action.payload.id) {
        state.currentCategory = action.payload;
      }
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
      if (state.currentCategory?.id === action.payload) {
        state.currentCategory = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all categories
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch category by ID
      .addCase(fetchCategoryByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create category
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // Update category
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
      })
      // Delete category
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null;
        }
      })
      // Toggle category status
      .addCase(toggleCategoryStatusThunk.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
      });
  },
});

export const { 
  clearError, 
  clearCurrentCategory, 
  addCategory, 
  updateCategory, 
  removeCategory 
} = categoriesSlice.actions;
export default categoriesSlice.reducer;