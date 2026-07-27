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
import { accountApi } from "@/api/account"

interface AccountContextType {
  accounts: Account[]
  loading: boolean
  loadCategories: () => Promise<void>
  createCategory: (type: TransactionType, name: string) => Promise<void>
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
    loadCategories()
  }, [isLoggingIn])

  const loadCategories = useCallback(async () => {
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

  const createCategory = useCallback(
    async (type: TransactionType, name: string) => {
      //   await categoryApi.create(type, name)
      await loadCategories()
    },
    []
  )

  return (
    <AccountContext.Provider
      value={{ accounts, loading, loadCategories, createCategory }}
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
