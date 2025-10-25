import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/ordersSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import paymentsReducer from '../features/payments/paymentsSlice';
import rentalsReducer from '../features/rentals/rentalsSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    orders: ordersReducer,
    categories: categoriesReducer,
    payments: paymentsReducer,
    rental: rentalsReducer,
    user: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/signin/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.token'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable listener behavior for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export default store;