// ============================================
// stores/actions/categoryActions.js
// ============================================
import { categoriesAPI } from '../../services/api';

export const createCategoryActions = (set, get) => ({
  // Fetch all categories
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await categoriesAPI.getAll();
      const categories = response.data;
      
      set({
        categories,
        isLoading: false,
        error: null,
      });
      
      return { success: true, categories };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch categories';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Fetch category by ID
  fetchCategoryById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await categoriesAPI.getById(id);
      const category = response.data;
      
      set({
        currentCategory: category,
        isLoading: false,
        error: null,
      });
      
      return { success: true, category };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch category';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Create category (admin only)
  createCategory: async (categoryData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await categoriesAPI.create(categoryData);
      const category = response.data;
      
      // Add to local state
      const { categories } = get();
      set({
        categories: [...categories, category],
        isLoading: false,
        error: null,
      });
      
      return { success: true, category };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create category';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Update category (admin only)
  updateCategory: async (id, categoryData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await categoriesAPI.update(id, categoryData);
      const updatedCategory = response.data;
      
      // Update local state
      const { categories } = get();
      const updatedCategories = categories.map(cat => 
        cat.id === id ? updatedCategory : cat
      );
      
      set({
        categories: updatedCategories,
        currentCategory: updatedCategory,
        isLoading: false,
        error: null,
      });
      
      return { success: true, category: updatedCategory };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update category';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Delete category (admin only)
  deleteCategory: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      await categoriesAPI.delete(id);
      
      // Remove from local state
      const { categories } = get();
      const filteredCategories = categories.filter(cat => cat.id !== id);
      
      set({
        categories: filteredCategories,
        currentCategory: null,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete category';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Clear current category
  clearCurrentCategory: () => set({ currentCategory: null }),

  // Clear error
  clearError: () => set({ error: null }),
});