// frontend/src/lib/api.js
// Client API axios — remplace complètement le SDK Base44
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur : ajouter le token JWT si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      // Ne pas rediriger automatiquement pour les pages publiques
    }
    return Promise.reject(error);
  }
);

// ─── Products API ───
export const productsApi = {
  list: (params = {}) => api.get('/products', { params }).then((r) => r.data),
  get: (idOrSlug) => api.get(`/products/${idOrSlug}`).then((r) => r.data),
  similar: (id) => api.get(`/products/${id}/similar`).then((r) => r.data),

  // Admin
  listAll: () => api.get('/products/admin/all').then((r) => r.data),
  create: (formData) => api.post('/products/admin', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data),
  update: (id, formData) => api.put(`/products/admin/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data),
  delete: (id) => api.delete(`/products/admin/${id}`).then((r) => r.data),
};

// ─── Orders API ───
export const ordersApi = {
  createCheckout: (data) => api.post('/orders/create-checkout', data).then((r) => r.data),
  verify: (sessionId) => api.get(`/orders/verify/${sessionId}`).then((r) => r.data),
  validatePromo: (code) => api.post('/orders/validate-promo', { code }).then((r) => r.data),

  // Admin
  listAll: () => api.get('/orders/admin/all').then((r) => r.data),
  stats: () => api.get('/orders/admin/stats').then((r) => r.data),
};

// ─── Auth API ───
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

// ─── Reviews API ───
export const reviewsApi = {
  list: (productId) => api.get(`/reviews/${productId}`).then((r) => r.data),
  create: (data) => api.post('/reviews', data).then((r) => r.data),
  delete: (id) => api.delete(`/reviews/admin/${id}`).then((r) => r.data),
};

export default api;
