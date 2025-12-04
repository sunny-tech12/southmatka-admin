// Location: admin-panel/src/utils/api.js

import axios from 'axios';

// Base URL - Change this to your backend URL
const BASE_URL = 'https://southmatka.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (phone, password) => api.post('/auth/login', { phone, password }),
  getProfile: () => api.get('/auth/me')
};

// Admin APIs
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),

  // Coin Stats
  getCoinStats: (days = 30) => api.get('/admin/coin-stats', { params: { days } }),

  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetail: (id) => api.get(`/admin/users/${id}`),
  addCoins: (id, amount, note) => api.put(`/admin/users/${id}/add-coins`, { amount, note }),
  subtractCoins: (id, amount, note) => api.put(`/admin/users/${id}/subtract-coins`, { amount, note }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),

  // Coin Requests
  getCoinRequests: (status) => api.get('/admin/coin-requests', { params: { status } }),
  approveCoinRequest: (id) => api.put(`/admin/coin-requests/${id}/approve`),
  rejectCoinRequest: (id, note) => api.put(`/admin/coin-requests/${id}/reject`, { note }),

  // Withdrawal Requests
  getWithdrawalRequests: (status) => api.get('/admin/withdrawal-requests', { params: { status } }),
  approveWithdrawal: (id) => api.put(`/admin/withdrawal-requests/${id}/approve`),
  rejectWithdrawal: (id, note) => api.put(`/admin/withdrawal-requests/${id}/reject`, { note }),
};

// Game APIs
export const gameAPI = {
  // Games
  getAllGames: (params) => api.get('/game/all', { params }),
  getGameDetail: (id) => api.get(`/game/${id}`),
  createGame: (data) => api.post('/game/create', data),
  activateGame: (id) => api.put(`/game/${id}/activate`),
  closeBetting: (id) => api.put(`/game/${id}/close-betting`),
  
  // NEW: Partial Result Declaration
  declareOpen: (id, open_panna) => 
    api.post(`/game/${id}/declare-open`, { open_panna }),
  declareClose: (id, close_panna) => 
    api.post(`/game/${id}/declare-close`, { close_panna }),
  
  // OLD: Full Result Declaration (kept for backwards compatibility)
  declareResult: (id, open_panna, close_panna) => 
    api.post(`/game/${id}/declare-result`, { open_panna, close_panna }),
  
  getGameBets: (id, status) => api.get(`/game/${id}/bets`, { params: { status } }),
  deleteGame: (id) => api.delete(`/game/${id}`)
};

// Helper function to handle API errors
export const handleAPIError = (error) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    return 'No response from server. Please check your connection.';
  } else {
    return error.message || 'An error occurred';
  }
};

export default api;