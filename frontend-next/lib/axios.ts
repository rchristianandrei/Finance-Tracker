import axios from "axios"
import axiosRetry from "axios-retry"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 20000,
})

axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 2000, // 2s, 4s, 6s
  retryCondition: (error) => {
    const url = error.config?.url ?? ""
    if (url.includes("/auth/refresh")) return false
    return (
      axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error)
    )
  },
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (
      error.response?.status !== 401 ||
      original.url?.includes("/auth/refresh")
    )
      return Promise.reject(error)

    try {
      await api.post("/auth/refresh")
      return api(original)
    } catch {
      return Promise.reject(error)
    }
  }
)

export default api
