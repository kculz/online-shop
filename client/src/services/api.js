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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  signin: (credentials) => api.post('/auth/signin', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  verifyToken: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
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