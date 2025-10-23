import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from './authAPI';

export const signinThunk = createAsyncThunk(
  'auth/signin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.signin(credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('authToken', token);
      
      return { user, token };
    } catch (error) {
      const message = error.response?.data?.error || 'Invalid credentials';
      return rejectWithValue(message);
    }
  }
);

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData);
      const { user, token } = response.data;
      
      localStorage.setItem('authToken', token);
      
      return { user, token };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return rejectWithValue('No token found');
    }
    
    try {
      const response = await authAPI.verifyToken();
      return { 
        user: response.data.user,
        token: token // Return the existing token
      };
    } catch (error) {
      localStorage.removeItem('authToken');
      return rejectWithValue('Invalid token');
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore API errors for logout
      console.log('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
    }
  }
);