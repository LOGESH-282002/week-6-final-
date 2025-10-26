// Posts API - Post-related API functions
import { apiClient } from './client'

export const postsApi = {
  // Get all posts with pagination
  getAll: async (page = 1, limit = 10) => {
    return apiClient.get(`/posts?page=${page}&limit=${limit}`)
  },

  // Get single post by ID
  getById: async (id) => {
    return apiClient.get(`/posts/${id}`)
  },

  // Create new post
  create: async (postData, token) => {
    return apiClient.withAuth(token).post('/posts', postData)
  },

  // Update post
  update: async (id, postData, token) => {
    return apiClient.withAuth(token).put(`/posts/${id}`, postData)
  },

  // Delete post
  delete: async (id, token) => {
    return apiClient.withAuth(token).delete(`/posts/${id}`)
  },
}

export default postsApi