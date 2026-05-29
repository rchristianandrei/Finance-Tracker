import api from "@/lib/axios"
import { LoginApiResponse } from "@/types/login-api-response"
import { User } from "@/types/user"

export const authApi = {
  googleLogin: (body: { idToken?: string }) => {
    return api.post<LoginApiResponse>("/auth/google", body)
  },
  getMe: () => {
    return api.get<User>("/auth/me")
  },
}
