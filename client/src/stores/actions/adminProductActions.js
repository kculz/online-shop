// ============================================
// stores/actions/adminProductActions.js
// ============================================
import { productsAPI } from '../../services/api';

export const createAdminProductActions = (set, get) => ({
  // Create product (admin only)
  createProduct: async (productData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await productsAPI.create(productData);
      const product = response.data;
      
      // Add to local state
      const { products } = get();
      set({
        products: [...products, product],
        isLoading: false,
        error: null,
      });
      
      return { success: true, product };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create product';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Update product (admin only)
  updateProduct: async (id, productData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await productsAPI.update(id, productData);
      const updatedProduct = response.data;
      
      // Update local state
      const { products } = get();
      const updatedProducts = products.map(product => 
        product.id === id ? updatedProduct : product
      );
      
      set({
        products: updatedProducts,
        currentProduct: updatedProduct,
        isLoading: false,
        error: null,
      });
      
      return { success: true, product: updatedProduct };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update product';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      await productsAPI.delete(id);
      
      // Remove from local state
      const { products } = get();
      const filteredProducts = products.filter(product => product.id !== id);
      
      set({
        products: filteredProducts,
        currentProduct: null,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete product';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },

  // Toggle product availability (admin only)
  toggleAvailability: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await productsAPI.toggleAvailability(id);
      const updatedProduct = response.data;
      
      // Update local state
      const { products } = get();
      const updatedProducts = products.map(product => 
        product.id === id ? updatedProduct : product
      );
      
      set({
        products: updatedProducts,
        isLoading: false,
        error: null,
      });
      
      return { success: true, product: updatedProduct };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to toggle availability';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  },
});