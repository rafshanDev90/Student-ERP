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
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data as
      | { statusCode?: number; success?: boolean; message?: string; data?: unknown }
      | undefined

    // Unwrap the server's { statusCode, success, message, data } envelope
    if (body && typeof body === 'object' && 'data' in body && 'success' in body) {
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