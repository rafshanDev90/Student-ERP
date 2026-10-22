import axios from 'axios'
import { useSessionStore } from '@/stores/session-store'

export const apiClient = axios.create({
  baseURL: '/api',
})

apiClient.interceptors.request.use((config) => {
  const token = useSessionStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // When sending FormData, let the browser set the multipart Content-Type
  // (including the boundary). Forcing a manual Content-Type here breaks uploads.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as
      | { status?: string; message?: string; data?: unknown }
      | undefined

    // Unwrap the server's { status, message, data } envelope
    if (
      body &&
      typeof body === 'object' &&
      'status' in body &&
      'message' in body &&
      'data' in body
    ) {
      return { ...response, data: body.data }
    }

    return response
  },
  (error) => {
    // Error toasts are handled globally by TanStack Query.
    // Normalize the shape so handlers can read our server's { message } payload.
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { message?: string; error?: string }
        | undefined
      error.message = data?.message ?? data?.error ?? error.message
    }
    return Promise.reject(error)
  }
)