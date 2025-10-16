// ============================================
// stores/actions/productActions.js
// ============================================
import { productsAPI } from '../../services/api';

export const createProductActions = (set, get) => ({
  // Fetch all products
  fetchProducts: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await productsAPI.getAll(params);
      const products = response.data;
      
      set({
        products,
        isLoading: false,
        error: null,
      });
      
      return { success: true, products };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch products';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Fetch product by ID
  fetchProductById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await productsAPI.getById(id);
      const product = response.data;
      
      set({
        currentProduct: product,
        isLoading: false,
        error: null,
      });
      
      return { success: true, product };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch product';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Fetch rental products
  fetchRentalProducts: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await productsAPI.getRentalProducts(params);
      const rentalProducts = response.data;
      
      set({
        rentalProducts,
        isLoading: false,
        error: null,
      });
      
      return { success: true, rentalProducts };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch rental products';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Fetch products by category
  fetchProductsByCategory: async (categoryId, params = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await productsAPI.getByCategory(categoryId, params);
      const products = response.data;
      
      set({
        products,
        isLoading: false,
        error: null,
      });
      
      return { success: true, products };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch products by category';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Clear current product
  clearCurrentProduct: () => set({ currentProduct: null }),

  // Clear error
  clearError: () => set({ error: null }),
});