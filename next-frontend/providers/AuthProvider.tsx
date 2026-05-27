import { authApi } from "@/api/auth"
import { LoginApiResponse } from "@/types/LoginApiResponse"
import { User } from "@/types/User"
import { createContext, useContext, useEffect, useState } from "react"

interface UserContextType {
  user: User | null
  loading: boolean
  googleLogin: (idToken: string) => Promise<LoginApiResponse>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await authApi.getMe()
        const data = response.data

        setUser(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const googleLogin = async (idToken: string) => {
    const response = await authApi.googleLogin({ idToken })

    const data = response.data

    if (data.status === 2) {
      setUser(data.user)
    }

    return data
  }

  return (
    <UserContext.Provider value={{ user, loading, googleLogin }}>
      {children}
    </UserContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
