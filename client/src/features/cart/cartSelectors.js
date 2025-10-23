import { createSelector } from 'reselect';

const selectCart = (state) => state.cart;

export const selectCartData = createSelector(
  [selectCart],
  (cart) => cart.cart
);

export const selectCartItems = createSelector(
  [selectCartData],
  (cart) => {
    if (!cart || !cart.items) return [];
    return cart.items;
  }
);

export const selectCartLoading = createSelector(
  [selectCart],
  (cart) => cart.isLoading
);

export const selectCartError = createSelector(
  [selectCart],
  (cart) => cart.error
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => {
    const price = item.priceAtAddition || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0)
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((count, item) => count + (item.quantity || 0), 0)
);

export const selectCartItemsWithDetails = createSelector(
  [selectCartItems],
  (items) => items.map(item => ({
    ...item,
    totalPrice: (item.priceAtAddition || 0) * (item.quantity || 0),
  }))
);

export const selectRentalItems = createSelector(
  [selectCartItems],
  (items) => items.filter(item => item.isForRental)
);

export const selectPurchaseItems = createSelector(
  [selectCartItems],
  (items) => items.filter(item => !item.isForRental)
);

export const selectIsCartEmpty = createSelector(
  [selectCartItems],
  (items) => items.length === 0
);

export const selectItemByProductId = (productId, isForRental = false) =>
  createSelector(
    [selectCartItems],
    (items) => items.find(
      item => item.productId === productId && item.isForRental === isForRental
    )
  );