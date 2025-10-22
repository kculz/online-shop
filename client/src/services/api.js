// ============================================
// 2. Fix services/api.js
// ============================================
import axios from 'axios';

// ✅ Make sure this matches your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('online-shop-storage');
      
      if (!window.location.pathname.includes('/login')) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// ✅ Auth API methods
export const authAPI = {
  signin: (credentials) => {
    console.log('🔐 Calling signin API:', credentials);
    return api.post('/auth/signin', credentials);
  },
  signup: (userData) => {
    console.log('📝 Calling signup API:', userData);
    return api.post('/auth/signup', userData);
  },
  verifyToken: () => {
    console.log('🔍 Calling verify token API');
    return api.get('/auth/verify');
  },
  logout: () => {
    console.log('👋 Calling logout API');
    return api.post('/auth/logout');
  },
};

// Products API methods
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId, params = {}) => api.get(`/products/category/${categoryId}`, { params }),
  getRentalProducts: (params = {}) => api.get('/products/rental/available', { params }),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  toggleAvailability: (id) => api.patch(`/products/${id}/availability`),
};

// Categories API methods
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Cart API methods
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (itemData) => api.post('/cart/items', itemData),
  updateItem: (itemId, itemData) => api.put(`/cart/items/${itemId}`, itemData),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

// Orders API methods
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
};

// Payments API methods
export const paymentsAPI = {
  processEcocash: (paymentData) => api.post('/payments/ecocash', paymentData),
  getPaymentHistory: () => api.get('/payments/history'),
  checkPaymentStatus: (paymentId) => api.get(`/payments/status/${paymentId}`),
};

// Rentals API methods
export const rentalsAPI = {
  getUserRentals: () => api.get('/rentals'),
  getAllRentals: () => api.get('/rentals/all'),
  processReturn: (rentalId, returnData) => api.post(`/rentals/${rentalId}/return`, returnData),
  checkOverdue: () => api.get('/rentals/overdue/check'),
};

// Users API methods
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;

