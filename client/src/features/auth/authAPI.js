import axiosInstance from '../../services/api'; // Assuming 'api.js' is in the same 'services' folder

/**
 * @fileoverview authAPI.js
 * Encapsulates all API calls related to authentication (signin, signup, token verification).
 * It uses the pre-configured axiosInstance which includes request/response interceptors 
 * for handling tokens and global 401 errors.
 */

export const authAPI = {
  /**
   * Sends sign-in credentials (username and password) to the server.
   * @param {Object} credentials - The user's sign-in data ({ username, password }).
   * @returns {Promise<AxiosResponse>} - A promise that resolves to the API response 
   * containing user data and token.
   */
  signin: (credentials) => {
    // POST request to the signin endpoint
    // The axiosInstance already has the base URL configured.
    return axiosInstance.post('/auth/signin', credentials);
  },

  /**
   * Sends user registration data to the server.
   * @param {Object} userData - The new user's registration data (e.g., { username, email, password }).
   * @returns {Promise<AxiosResponse>} - A promise that resolves to the API response 
   * containing the newly created user data and token.
   */
  signup: (userData) => {
    // POST request to the signup endpoint
    return axiosInstance.post('/auth/signup', userData);
  },

  /**
   * Requests the server to log out the user.
   * NOTE: Even if the server doesn't require a dedicated logout endpoint (because the token is simply removed 
   * client-side), having an endpoint is a good practice for server-side cleanup/revocation.
   * @returns {Promise<AxiosResponse>} - A promise that resolves when the logout is complete.
   */
  logout: () => {
    // POST request to the logout endpoint (usually '/auth/logout' or similar)
    return axiosInstance.post('/auth/logout');
  },

  /**
   * Verifies the validity of the current token by checking the user's session status.
   * This is typically used during application initialization.
   * @returns {Promise<AxiosResponse>} - A promise that resolves to the API response 
   * containing the verified user data.
   */
  verifyToken: () => {
    // GET request to a protected endpoint (e.g., '/auth/me' or '/auth/verify')
    // The token is automatically attached by the request interceptor in 'api.js'.
    return axiosInstance.get('/auth/me');
  },
};
