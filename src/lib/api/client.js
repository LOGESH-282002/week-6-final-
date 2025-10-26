// API Client - Centralized API request handling

/**
 * Base API client with common request handling
 */
class ApiClient {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options })
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'POST', body, ...options })
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'PUT', body, ...options })
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options })
  }

  withAuth(token) {
    return {
      get: (endpoint, options = {}) => this.get(endpoint, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` }
      }),
      post: (endpoint, body, options = {}) => this.post(endpoint, body, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` }
      }),
      put: (endpoint, body, options = {}) => this.put(endpoint, body, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` }
      }),
      delete: (endpoint, options = {}) => this.delete(endpoint, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` }
      }),
    }
  }
}

export const apiClient = new ApiClient()
export default apiClient