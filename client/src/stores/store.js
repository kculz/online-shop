// ============================================
// stores/store.js - FIXED VERSION
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
        // ✅ FIX: Persist authentication state properly
        partialize: (state) => ({
          // Persist auth data
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
        // ✅ FIX: Use sessionStorage instead of localStorage for security
        storage: {
          getItem: (name) => {
            const str = sessionStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          },
          setItem: (name, value) => {
            sessionStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            sessionStorage.removeItem(name);
          },
        },
      }
    )
  )
);

export default useStore;