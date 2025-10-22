// ============================================
// Categories Selectors (features/categories/categoriesSelectors.js)
// ============================================

import { createSelector } from 'reselect';

const selectCategories = (state) => state.categories;

export const selectAllCategories = createSelector(
  [selectCategories],
  (categories) => categories.categories
);

export const selectCurrentCategory = createSelector(
  [selectCategories],
  (categories) => categories.currentCategory
);

export const selectCategoriesLoading = createSelector(
  [selectCategories],
  (categories) => categories.isLoading
);

export const selectCategoriesError = createSelector(
  [selectCategories],
  (categories) => categories.error
);

export const selectActiveCategories = createSelector(
  [selectAllCategories],
  (categories) => categories.filter(cat => cat.isActive !== false)
);

export const selectFeaturedCategories = createSelector(
  [selectActiveCategories],
  (categories) => categories.filter(cat => cat.isFeatured).slice(0, 8)
);

export const selectCategoryById = (categoryId) =>
  createSelector(
    [selectAllCategories],
    (categories) => categories.find(cat => cat.id === categoryId)
  );

export const selectCategoriesWithProductCount = createSelector(
  [selectAllCategories, (state) => state.products.products],
  (categories, products) => {
    if (!products || products.length === 0) {
      return categories.map(cat => ({ ...cat, productCount: 0 }));
    }

    const productCountByCategory = products.reduce((acc, product) => {
      const categoryId = product.categoryId;
      acc[categoryId] = (acc[categoryId] || 0) + 1;
      return acc;
    }, {});

    return categories.map(cat => ({
      ...cat,
      productCount: productCountByCategory[cat.id] || 0,
    }));
  }
);

export const selectActiveCategoriesWithProductCount = createSelector(
  [selectCategoriesWithProductCount],
  (categories) => categories.filter(cat => cat.isActive !== false)
);

export const selectCategoriesSortedByName = createSelector(
  [selectAllCategories],
  (categories) => [...categories].sort((a, b) => a.name.localeCompare(b.name))
);

export const selectCategoriesHierarchy = createSelector(
  [selectAllCategories],
  (categories) => {
    const rootCategories = categories.filter(cat => !cat.parentId);
    const childCategories = categories.filter(cat => cat.parentId);
    
    return rootCategories.map(rootCat => ({
      ...rootCat,
      children: childCategories.filter(child => child.parentId === rootCat.id),
    }));
  }
);

export const selectCategoryOptions = createSelector(
  [selectActiveCategories],
  (categories) => categories.map(cat => ({
    value: cat.id,
    label: cat.name,
    description: cat.description,
  }))
);

export const selectIsCategoryEmpty = (categoryId) =>
  createSelector(
    [selectAllCategories, (state) => state.products.products],
    (categories, products) => {
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) return true;
      
      const categoryProducts = products.filter(product => product.categoryId === categoryId);
      return categoryProducts.length === 0;
    }
  );

export const selectCategoriesStats = createSelector(
  [selectAllCategories, (state) => state.products.products],
  (categories, products) => {
    const totalCategories = categories.length;
    const activeCategories = categories.filter(cat => cat.isActive !== false).length;
    const inactiveCategories = categories.filter(cat => cat.isActive === false).length;
    
    const categoriesWithProducts = categories.map(cat => {
      const categoryProducts = products.filter(product => product.categoryId === cat.id);
      return {
        ...cat,
        productCount: categoryProducts.length,
        availableProducts: categoryProducts.filter(p => p.isAvailable).length,
      };
    });

    const totalProducts = categoriesWithProducts.reduce((sum, cat) => sum + cat.productCount, 0);
    const averageProductsPerCategory = totalCategories > 0 ? totalProducts / totalCategories : 0;

    return {
      totalCategories,
      activeCategories,
      inactiveCategories,
      totalProducts,
      averageProductsPerCategory,
      categoriesWithProducts,
    };
  }
);