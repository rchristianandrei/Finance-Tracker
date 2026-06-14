import axios from "axios"
import axiosRetry from "axios-retry"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 20000,
})

axiosRetry(api, {
  retries: 3,
  retryDelay: (count) => count * 2000,
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
      (error.code === "ERR_CANCELED" || error.response?.status === 401) &&
      !original._retry
    ) {
      try {
        original._retry = true

        await api.post("/auth/refresh")

        return api(original)
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
