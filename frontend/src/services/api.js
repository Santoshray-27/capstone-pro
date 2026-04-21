/**
 * API Service Layer
 * Centralized Axios configuration with interceptors
 */

import axios from 'axios';

// Base API URL - use Vite proxy in dev, absolute URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// Request Interceptor
// ========================
api.interceptors.request.use(
  (config) => {
    // Attach JWT token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// Response Interceptor
// ========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout on 401 (unauthorized)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========================
// Auth API
// ========================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ========================
// Resume API
// ========================
export const resumeAPI = {
  upload: (formData) => api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => api.get('/resumes', { params }),
  getById: (id) => api.get(`/resumes/${id}`),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
};

// ========================
// Analysis API
// ========================
export const analysisAPI = {
  analyze: (resumeId, data) => api.post(`/analysis/analyze/${resumeId}`, data),
  getByResume: (resumeId) => api.get(`/analysis/resume/${resumeId}`),
  getById: (id) => api.get(`/analysis/${id}`),
  getAll: (params) => api.get('/analysis/my/all', { params }),
};

// ========================
// Jobs API
// ========================
export const jobsAPI = {
  getRecommendations: () => api.get('/jobs/recommendations'),
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// ========================
// Interview API
// ========================
export const interviewAPI = {
  create: (data) => api.post('/interviews/create', data),
  getAll: () => api.get('/interviews'),
  getById: (id) => api.get(`/interviews/${id}`),
  submitAnswer: (id, data) => api.post(`/interviews/${id}/answer`, data),
  complete: (id) => api.post(`/interviews/${id}/complete`),
};

// ========================
// Dashboard API
// ========================
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAdminStats: () => api.get('/dashboard/admin'),
};

// ========================
// Feedback API
// ========================
export const feedbackAPI = {
  create: (data) => api.post('/feedback', data),
  getMy: () => api.get('/feedback/my'),
};

// ========================
// Recruiter API
// ========================
export const recruiterAPI = {
  getDashboard: () => api.get('/recruiter/dashboard'),
  searchCandidates: (params) => api.get('/recruiter/candidates', { params }),
};

export default api;
