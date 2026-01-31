import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4500/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any request preprocessing here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await authApi.refreshToken();
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  changePassword: (data) => api.patch('/auth/change-password', data),
  addAddress: (data) => api.post('/auth/addresses', data),
  updateAddress: (id, data) => api.patch(`/auth/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
};

// Product API
export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getFeatured: (limit) => api.get('/products/featured', { params: { limit } }),
  search: (query, params) => api.get('/products/search', { params: { q: query, ...params } }),
  getCategoriesCount: () => api.get('/products/categories/count'),
};

// Admin Product API
export const adminProductApi = {
  create: (data) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(data).forEach(key => {
      if (key !== 'images' && data[key] !== undefined && data[key] !== null) {
        if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    
    // Append images
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    return api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  update: (id, data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key !== 'images' && key !== 'removedImageIds' && data[key] !== undefined) {
        if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    if (data.removedImageIds && data.removedImageIds.length > 0) {
      formData.append('removedImageIds', JSON.stringify(data.removedImageIds));
    }
    
    return api.patch(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  delete: (id) => api.delete(`/admin/products/${id}`),
  toggleFeatured: (id) => api.patch(`/admin/products/${id}/featured`),
  bulkUpdateStatus: (productIds, isActive) => 
    api.post('/admin/products/bulk/status', { productIds, isActive }),
  bulkDelete: (productIds) => 
    api.post('/admin/products/bulk/delete', { productIds }),
  getLowStock: () => api.get('/admin/products/low-stock'),
};

// Order API
export const orderApi = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.patch(`/orders/${id}/cancel`, { reason }),
};

// Admin Order API
export const adminOrderApi = {
  getAll: (params) => api.get('/admin/orders', { params }),
  updateStatus: (id, data) => api.patch(`/admin/orders/${id}/status`, data),
  getDashboardStats: (dateRange) => api.get('/admin/orders/dashboard-stats', { params: dateRange }),
  getSalesReport: (dateRange) => api.get('/admin/orders/sales-report', { params: dateRange }),
  delete: (id) => api.delete(`/admin/orders/${id}`),
};

// Admin User API
export const adminUserApi = {
  getAll: (params) => api.get('/admin/users', { params }),
  getById: (id) => api.get(`/admin/users/${id}`),
  updateRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  toggleActive: (id) => api.patch(`/admin/users/${id}/toggle-active`),
  getStatistics: () => api.get('/admin/users/statistics'),
};

export default api;
