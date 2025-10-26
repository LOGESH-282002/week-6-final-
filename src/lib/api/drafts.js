// Drafts API - Draft-related API functions
import { apiClient } from './client'

export const draftsApi = {
  // Get all drafts for authenticated user
  getAll: async (token, page = 1, limit = 10) => {
    return apiClient.withAuth(token).get(`/drafts?page=${page}&limit=${limit}`)
  },

  // Get single draft by ID
  getById: async (id, token) => {
    return apiClient.withAuth(token).get(`/drafts/${id}`)
  },

  // Create or update draft
  save: async (draftData, token) => {
    return apiClient.withAuth(token).post('/drafts', draftData)
  },

  // Delete draft
  delete: async (id, token) => {
    return apiClient.withAuth(token).delete(`/drafts/${id}`)
  },

  // Publish draft as post
  publish: async (id, token) => {
    return apiClient.withAuth(token).post(`/drafts/${id}`)
  },
}

export default draftsApi