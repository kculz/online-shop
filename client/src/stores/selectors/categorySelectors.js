// ============================================
// stores/selectors/categorySelectors.js
// ============================================
export const categorySelectors = {
  // Select all categories
  categories: (state) => state.categories,
  
  // Select current category
  currentCategory: (state) => state.currentCategory,
  
  // Select loading state
  isLoading: (state) => state.isLoading,
  
  // Select error
  error: (state) => state.error,
  
  // Derived selectors
  // Get category by ID
  categoryById: (id) => (state) => 
    state.categories?.find(category => category.id === id) || null,
  
  // Get categories with product counts (if available)
  categoriesWithCounts: (state) => 
    state.categories?.map(category => ({
      ...category,
      productCount: category.products?.length || 0,
    })) || [],
  
  // Get main categories (no parent)
  mainCategories: (state) => 
    state.categories?.filter(category => !category.parentId) || [],
  
  // Get subcategories by parent ID
  subcategories: (parentId) => (state) => 
    state.categories?.filter(category => category.parentId === parentId) || [],
  
  // Get categories that have products
  categoriesWithProducts: (state) => 
    state.categories?.filter(category => category.products?.length > 0) || [],
};