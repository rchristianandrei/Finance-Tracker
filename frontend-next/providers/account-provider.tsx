import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { TransactionType } from "@/types/category"
import axios from "axios"
import { useAuth } from "./auth-provider"
import { Account } from "@/types/account"
import { accountApi, CreateAccountRequest } from "@/api/account"

interface AccountContextType {
  accounts: Account[]
  loading: boolean
  loadAccounts: () => Promise<void>
  createAccount: (data: CreateAccountRequest) => Promise<void>
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { loading: isLoggingIn, user } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoggingIn) return
    if (!user) {
      setLoading(false)
      return
    }
    loadAccounts()
  }, [isLoggingIn])

  const loadAccounts = useCallback(async () => {
    try {
      const response = await accountApi.getAccounts()
      const data = response.data

      setAccounts(data)
    } catch (err) {
      if (axios.isCancel(err)) return
    } finally {
      setLoading(false)
    }
  }, [])

  const createAccount = useCallback(async (data: CreateAccountRequest) => {
    await accountApi.create(data)
    await loadAccounts()
  }, [])

  return (
    <AccountContext.Provider
      value={{ accounts, loading, loadAccounts, createAccount }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider")
  }

  return context
}
