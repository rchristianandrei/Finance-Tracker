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
    return (
      axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error)
    )
  },
})

export default api
