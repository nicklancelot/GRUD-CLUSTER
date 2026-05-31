import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 5000,
})

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('auth_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

function unwrapResponse(response) {
  return response.data?.data ?? response.data
}

export async function loginUser(payload) {
  const response = await apiClient.post('/auth/login', payload)
  return unwrapResponse(response)
}

export async function getUsers({ search = '', page = 1, limit = 5 } = {}) {
  const response = await apiClient.get('/users', {
    params: {
      search,
      page,
      limit,
    },
  })

  return response.data
}

export async function createUser(payload) {
  const response = await apiClient.post('/users', payload)
  return unwrapResponse(response)
}

export async function updateUser(id, payload) {
  const response = await apiClient.put(`/users/${id}`, payload)
  return unwrapResponse(response)
}

export async function deleteUser(id) {
  const response = await apiClient.delete(`/users/${id}`)
  return response.data
}
