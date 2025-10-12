// ============================================
// services/api.js
// ============================================
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API methods
export const authAPI = {
  signin: (credentials) => api.post('/auth/signin', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  verifyToken: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
};

export default api;