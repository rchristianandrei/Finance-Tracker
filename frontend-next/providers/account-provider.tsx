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
import {
  accountApi,
  CreateAccountRequest,
  TransferBalanceRequest,
  UpdateAccountRequest,
} from "@/api/account"

interface AccountContextType {
  accounts: Account[]
  loading: boolean
  createAccount: (data: CreateAccountRequest) => Promise<void>
  transferBalance: (details: TransferBalanceRequest) => Promise<void>
  loadAccounts: () => Promise<void>
  updateAccount: (data: UpdateAccountRequest) => Promise<void>
  deleteAccount: (accountId: number) => Promise<void>
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
  }, [isLoggingIn, user])

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

  const transferBalance = useCallback(
    async (details: TransferBalanceRequest) => {
      await accountApi.transferBalance(details)
      await loadAccounts()
    },
    []
  )

  const updateAccount = useCallback(async (data: UpdateAccountRequest) => {
    await accountApi.update(data)
    await loadAccounts()
  }, [])

  const deleteAccount = useCallback(async (accountId: number) => {
    await accountApi.delete(accountId)
    await loadAccounts()
  }, [])

  return (
    <AccountContext.Provider
      value={{
        accounts,
        loading,
        loadAccounts,
        createAccount,
        transferBalance,
        updateAccount,
        deleteAccount,
      }}
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
