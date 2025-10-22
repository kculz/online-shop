// ============================================
// 3. Products Selectors (features/products/productsSelectors.js)
// ============================================
import { createSelector } from 'reselect';

const selectProducts = (state) => state.products;

export const selectAllProducts = createSelector(
  [selectProducts],
  (products) => products.products
);

export const selectRentalProducts = createSelector(
  [selectProducts],
  (products) => products.rentalProducts
);

export const selectCurrentProduct = createSelector(
  [selectProducts],
  (products) => products.currentProduct
);

export const selectProductsLoading = createSelector(
  [selectProducts],
  (products) => products.isLoading
);

export const selectProductsError = createSelector(
  [selectProducts],
  (products) => products.error
);

export const selectAvailableProducts = createSelector(
  [selectAllProducts],
  (products) => products.filter(p => p.isAvailable)
);

export const selectFeaturedProducts = createSelector(
  [selectAvailableProducts],
  (products) => products.filter(p => p.isFeatured).slice(0, 6)
);

export const selectProductsByCategory = (categoryId) =>
  createSelector(
    [selectAllProducts],
    (products) => products.filter(p => p.categoryId === categoryId)
  );

export const selectProductById = (id) =>
  createSelector(
    [selectAllProducts],
    (products) => products.find(p => p.id === id)
  );

export const selectAvailableRentalProducts = createSelector(
  [selectRentalProducts],
  (products) => products.filter(p => p.isAvailable && p.canBeRented)
);

export const selectPriceRange = createSelector(
  [selectAllProducts],
  (products) => {
    if (products.length === 0) return { min: 0, max: 1000 };
    
    const prices = products.map(p => p.price).filter(Boolean);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
);