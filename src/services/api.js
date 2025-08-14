import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateProfile: (id, profileData) => api.put(`/users/${id}/profile`, profileData),
};

// Items API
export const itemsAPI = {
  getAllItems: (params = {}) => api.get('/items', { params }),
  getItemById: (id) => api.get(`/items/${id}`),
  createItem: (itemData) => api.post('/items', itemData),
  updateItem: (id, itemData) => api.put(`/items/${id}`, itemData),
  deleteItem: (id) => api.delete(`/items/${id}`),
  getUserItems: (userId) => api.get(`/users/${userId}/items`),
  searchItems: (query) => api.get('/items/search', { params: { q: query } }),
  getItemsByCategory: (categoryId) => api.get(`/categories/${categoryId}/items`),
  uploadItemImages: (itemId, formData) => api.post(`/items/${itemId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Categories API
export const categoriesAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Transactions API
export const transactionsAPI = {
  getAllTransactions: () => api.get('/transactions'),
  getTransactionById: (id) => api.get(`/transactions/${id}`),
  createTransaction: (transactionData) => api.post('/transactions', transactionData),
  updateTransaction: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),
  getUserTransactions: (userId) => api.get(`/users/${userId}/transactions`),
  confirmPayment: (id) => api.post(`/transactions/${id}/confirm-payment`),
  completeTransaction: (id) => api.post(`/transactions/${id}/complete`),
  cancelTransaction: (id, reason) => api.post(`/transactions/${id}/cancel`, { reason }),
};

// Offers API
export const offersAPI = {
  getAllOffers: () => api.get('/offers'),
  getOfferById: (id) => api.get(`/offers/${id}`),
  createOffer: (offerData) => api.post('/offers', offerData),
  updateOffer: (id, offerData) => api.put(`/offers/${id}`, offerData),
  deleteOffer: (id) => api.delete(`/offers/${id}`),
  acceptOffer: (id) => api.post(`/offers/${id}/accept`),
  rejectOffer: (id) => api.post(`/offers/${id}/reject`),
  counterOffer: (id, counterData) => api.post(`/offers/${id}/counter`, counterData),
  getUserOffers: (userId) => api.get(`/users/${userId}/offers`),
  getItemOffers: (itemId) => api.get(`/items/${itemId}/offers`),
};

// Messages API
export const messagesAPI = {
  getAllMessages: () => api.get('/messages'),
  getMessageById: (id) => api.get(`/messages/${id}`),
  sendMessage: (messageData) => api.post('/messages', messageData),
  getConversation: (userId1, userId2) => api.get(`/messages/conversation/${userId1}/${userId2}`),
  getUserMessages: (userId) => api.get(`/users/${userId}/messages`),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};

// File upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadMultipleImages: (formData) => api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api; 