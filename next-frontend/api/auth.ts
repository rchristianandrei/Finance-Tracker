import api from "@/lib/axios"
import { LoginApiResponse } from "@/types/LoginApiResponse"
import { User } from "@/types/User"

export const authApi = {
  googleLogin: (body: { idToken?: string }) => {
    return api.post<LoginApiResponse>("/auth/google", body)
  },
  getMe: () => {
    return api.get<User>("/auth/me")
  },
}
