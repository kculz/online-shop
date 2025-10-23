import axiosInstance from '../../services/api';

export const authAPI = {
  signin: (credentials) => {
    return axiosInstance.post('/auth/signin', credentials);
  },

  signup: (userData) => {
    return axiosInstance.post('/auth/signup', userData);
  },

  logout: () => {
    return axiosInstance.post('/auth/logout');
  },

  verifyToken: () => {
    return axiosInstance.get('/auth/me');
  },
};