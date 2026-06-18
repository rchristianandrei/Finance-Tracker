import axios from "axios"
import axiosRetry from "axios-retry"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 20000,
})

axiosRetry(api, {
  retries: 3,
  retryDelay: (count) => count * 1250,
  retryCondition: (error) => {
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
      !original?.url?.includes("/auth/refresh")
    ) {
      try {
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
