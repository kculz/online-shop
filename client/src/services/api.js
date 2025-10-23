// ============================================
// API Configuration with Redux
// services/api.js 
// ============================================

import axios from 'axios';
import { store } from '../app/store';
import { clearCredentials } from '../features/auth/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token || sessionStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status);
    console.error('❌ API Error:', error.response?.error || error.message);
    
    if (error.response?.status === 401) {
      sessionStorage.removeItem('authToken');
      store.dispatch(clearCredentials());
      
      if (!window.location.pathname.includes('/login')) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;