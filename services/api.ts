import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Organizations API
export const organizationsApi = {
  getAll: () => api.get('/organizations/'),
  getById: (id: number) => api.get(`/organizations/${id}/`),
  create: (data: any) => api.post('/organizations/', data),
  update: (id: number, data: any) => api.put(`/organizations/${id}/`, data),
  delete: (id: number) => api.delete(`/organizations/${id}/`),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/users/'),
  getById: (id: number) => api.get(`/users/${id}/`),
  create: (data: any) => api.post('/users/', data),
  update: (id: number, data: any) => api.put(`/users/${id}/`, data),
  delete: (id: number) => api.delete(`/users/${id}/`),
  getByOrganization: (orgId: number) => api.get(`/organizations/${orgId}/users/`),
};

// Authentication API
export const authApi = {
  signup: (data: any) => api.post('/auth/signup/', data),
  login: (data: { username: string; password: string }) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data: any) => api.put('/auth/update-profile/', data),
  userRegistration: (data: any) => api.post('/auth/user-registration/', data),
  getOrganizationsList: () => api.get('/organizations-list/'),
};

export default api;
