import { createSlice } from '@reduxjs/toolkit';

// Helper function to get initial state
const getInitialState = () => {
  const token = localStorage.getItem('authToken');
  return {
    user: null,
    token: token || null,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Signin
      .addCase('auth/signin/pending', (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase('auth/signin/fulfilled', (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('authToken', action.payload.token);
      })
      .addCase('auth/signin/rejected', (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
        localStorage.removeItem('authToken');
      })
      // Signup
      .addCase('auth/signup/pending', (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase('auth/signup/fulfilled', (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('authToken', action.payload.token);
      })
      .addCase('auth/signup/rejected', (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
        localStorage.removeItem('authToken');
      })
      // Check Auth
      .addCase('auth/checkAuth/pending', (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase('auth/checkAuth/fulfilled', (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Ensure token is set if not already
        if (!state.token && action.payload.token) {
          state.token = action.payload.token;
          localStorage.setItem('authToken', action.payload.token);
        }
      })
      .addCase('auth/checkAuth/rejected', (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        localStorage.removeItem('authToken');
      })
      // Logout
      .addCase('auth/logout/pending', (state) => {
        state.isLoading = true;
      })
      .addCase('auth/logout/fulfilled', (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('authToken');
      })
      .addCase('auth/logout/rejected', (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('authToken');
      });
  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;