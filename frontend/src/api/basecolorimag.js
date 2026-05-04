// frontend/src/api/basecolorimag.js
// Client API centralisé ColoriMagiques — remplace base44Clients.js
// Toutes les interactions backend passent par ce module unique.
import axios from 'axios';

// ─── Configuration ───
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Intercepteur : JWT automatique ───
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Intercepteur : gestion 401 ───
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
    }
    return Promise.reject(error);
  }
);

// ════════════════════════════════════════════
// Client unifié ColoriMagiques
// ════════════════════════════════════════════
export const colorimagiques = {
  // ─── Auth ───
  auth: {
    login: (email, password) =>
      client.post('/auth/login', { email, password }).then((r) => r.data),
    me: () =>
      client.get('/auth/me').then((r) => r.data),
  },

  // ─── Produits (public) ───
  products: {
    list: (params = {}) =>
      client.get('/products', { params }).then((r) => r.data),
    get: (idOrSlug) =>
      client.get(`/products/${idOrSlug}`).then((r) => r.data),
    similar: (id) =>
      client.get(`/products/${id}/similar`).then((r) => r.data),
  },

  // ─── Produits (admin) ───
  admin: {
    products: {
      listAll: () =>
        client.get('/products/admin/all').then((r) => r.data),
      create: (formData) =>
        client.post('/products/admin', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then((r) => r.data),
      update: (id, formData) =>
        client.put(`/products/admin/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then((r) => r.data),
      delete: (id) =>
        client.delete(`/products/admin/${id}`).then((r) => r.data),
    },
    orders: {
      listAll: () =>
        client.get('/orders/admin/all').then((r) => r.data),
      stats: () =>
        client.get('/orders/admin/stats').then((r) => r.data),
    },
    reviews: {
      listAll: () =>
        client.get('/reviews/admin/all').then((r) => r.data),
      pending: () =>
        client.get('/reviews/admin/pending').then((r) => r.data),
      approve: (id) =>
        client.patch(`/reviews/admin/${id}/approve`).then((r) => r.data),
      reject: (id) =>
        client.patch(`/reviews/admin/${id}/reject`).then((r) => r.data),
      delete: (id) =>
        client.delete(`/reviews/admin/${id}`).then((r) => r.data),
    },
  },

  // ─── Commandes (public) ───
  orders: {
    createCheckout: (data) =>
      client.post('/orders/create-checkout', data).then((r) => r.data),
    verify: (sessionId) =>
      client.get(`/orders/verify/${sessionId}`).then((r) => r.data),
    validatePromo: (code) =>
      client.post('/orders/validate-promo', { code }).then((r) => r.data),
  },

  // ─── Avis (public) ───
  reviews: {
    list: (productId) =>
      client.get(`/reviews/${productId}`).then((r) => r.data),
    create: (data) =>
      client.post('/reviews', data).then((r) => r.data),
  },

  // ─── Newsletter ───
  newsletter: {
    subscribe: (email, lang = 'fr') =>
      client.post('/newsletter/subscribe', { email, lang }).then((r) => r.data),
  },
};

// ─── Exports rétrocompatibles (pour migration progressive) ───
export const productsApi = {
  ...colorimagiques.products,
  ...colorimagiques.admin.products,
};
export const ordersApi = {
  ...colorimagiques.orders,
  ...colorimagiques.admin.orders,
};
export const authApi = colorimagiques.auth;
export const reviewsApi = {
  ...colorimagiques.reviews,
  ...colorimagiques.admin.reviews,
};

export default colorimagiques;
