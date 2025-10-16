// ============================================
// stores/selectors/productSelectors.js
// ============================================
export const productSelectors = {
  // Select all products
  products: (state) => state.products,
  
  // Select rental products
  rentalProducts: (state) => state.rentalProducts,
  
  // Select current product
  currentProduct: (state) => state.currentProduct,
  
  // Select loading state
  isLoading: (state) => state.isLoading,
  
  // Select error
  error: (state) => state.error,
  
  // Derived selectors
  featuredProducts: (state) => state.products?.slice(0, 6) || [],
  
  availableProducts: (state) => 
    state.products?.filter(product => product.isAvailable) || [],
  
  productsByCategory: (categoryId) => (state) => 
    state.products?.filter(product => product.categoryId === categoryId) || [],
  
  // Get product by ID
  productById: (id) => (state) => 
    state.products?.find(product => product.id === id) || null,
  
  // Rental product selectors
  availableRentalProducts: (state) => 
    state.rentalProducts?.filter(product => product.isAvailable && product.canBeRented) || [],
  
  // Price range helpers
  minProductPrice: (state) => 
    Math.min(...state.products?.map(p => p.price).filter(Boolean)) || 0,
  
  maxProductPrice: (state) => 
    Math.max(...state.products?.map(p => p.price).filter(Boolean)) || 1000,
};