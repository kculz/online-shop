// stores/store.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authSlice } from './slices/authSlice';
// import { uiSlice } from './slices/uiSlice';
// import { cartSlice } from './slices/cartSlice';

// Combine all slices into a single store
export const useStore = create()(
  devtools(
    persist(
      (...a) => ({
        ...authSlice(...a),
        // ...uiSlice(...a),
        // ...cartSlice(...a),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          auth: {
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
          },
        //   cart: state.cart,
        }),
      }
    )
  )
);