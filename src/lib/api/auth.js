// Auth API - Authentication-related API functions
import { apiClient } from './client'

export const authApi = {
  // User registration
  register: async (userData) => {
    return apiClient.post('/auth/register', userData)
  },

  // User login
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials)
  },

  // Get current user session
  getSession: async (token) => {
    return apiClient.withAuth(token).get('/auth/session')
  },

  // Refresh token
  refresh: async (refreshToken) => {
    return apiClient.post('/auth/refresh', { refreshToken })
  },

  // Logout
  logout: async (token) => {
    return apiClient.withAuth(token).post('/auth/logout')
  },
}

export default authApi