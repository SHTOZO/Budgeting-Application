import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: (email, password, name) =>
    api.post('/auth/register', { email, password, name }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// Budget Service
export const budgetService = {
  getBudgets: () => api.get('/budgets'),
  createBudget: (data) => api.post('/budgets', data),
  getBudget: (id) => api.get(`/budgets/${id}`),
  updateBudget: (id, data) => api.put(`/budgets/${id}`, data),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
  addCategory: (budgetId, categoryId, allocatedAmount) =>
    api.post(`/budgets/${budgetId}/categories`, { categoryId, allocatedAmount }),
};

// Category Service
export const categoryService = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Expense Service
export const expenseService = {
  getExpenses: (filters) => api.get('/expenses', { params: filters }),
  createExpense: (data) => api.post('/expenses', data),
  getExpense: (id) => api.get(`/expenses/${id}`),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

export default api;
