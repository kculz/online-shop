// ============================================
// stores/store.js
// ============================================
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authSlice } from './slices/authSlice';

// Combine all slices
const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Auth slice
        ...authSlice(set, get),
        
        // Add other slices here as needed
        // ...cartSlice(set, get),
        // ...productSlice(set, get),
      }),
      {
        name: 'online-shop-storage',
        partialize: (state) => ({
          // Only persist these fields
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

export default useStore;