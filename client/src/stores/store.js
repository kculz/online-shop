// ============================================
// stores/store.js
// ============================================
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authSlice } from './slices/authSlice';
import { productSlice } from './slices/productSlice';
import { cartSlice } from './slices/cartSlice';
import { orderSlice } from './slices/orderSlice';
import { categorySlice } from './slices/categorySlice';
import { paymentSlice } from './slices/paymentSlice';
import { userSlice } from './slices/userSlice';
import { rentalSlice } from './slices/rentalSilce';

// Combine all slices
const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Auth slice
        ...authSlice(set, get),
        
        // Product slice
        ...productSlice(set, get),
        
        // Cart slice
        ...cartSlice(set, get),
        
        // Order slice
        ...orderSlice(set, get),
        
        // Category slice
        ...categorySlice(set, get),
        
        // Payment slice
        ...paymentSlice(set, get),
        
        // Rental slice
        ...rentalSlice(set, get),
        
        // User slice
        ...userSlice(set, get),
      }),
      {
        name: 'online-shop-storage',
        partialize: (state) => ({
          // Only persist these fields
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          cart: state.cart,
        }),
      }
    )
  )
);

export default useStore;