import { accountApi } from "@/api/account"
import { Account } from "@/types/account"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useAuth } from "./auth-provider"
import axios from "axios"
import { manageSession } from "@/lib/session-storage"

interface AccountContextType {
  accounts: Account[]
  selectedAccount: Account | null
  loading: boolean
  createAccount: (values: { name: string }) => Promise<void>
  setSelectedAccount: (accountId: number | null) => void
  updateAccount: (values: { id: number; name: string }) => Promise<void>
  deleteAccount: (accountId: number) => Promise<void>
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  const selectedAccount = useMemo(() => {
    return accounts.find((account) => account.id === selectedAccountId) || null
  }, [accounts, selectedAccountId])

  useEffect(() => {
    ;(async () => {
      if (!user) return

      try {
        const response = await accountApi.getAccounts()
        const data = response.data

        setAccounts(data.accounts)
        setSelectedAccount(
          (manageSession.getSelectedAccountId() ?? data.defaultAccount?.id) ||
            null
        )
      } catch (err) {
        if (axios.isCancel(err)) return
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  const createAccount = useCallback(async (values: { name: string }) => {
    const response = await accountApi.createAccount(values)
    const createdAccount = response.data
    setAccounts((prev) => [...prev, createdAccount])
  }, [])

  const setSelectedAccount = useCallback((accountId: number | null) => {
    setSelectedAccountId(accountId)
    manageSession.setSelectedAccountId(accountId)
  }, [])

  const updateAccount = useCallback(
    async (values: { id: number; name: string }) => {
      const response = await accountApi.updateAccount(values)
      const updatedAccount = response.data
      setAccounts((prev) =>
        prev.map((a) => (a.id === updatedAccount.id ? updatedAccount : a))
      )
    },
    []
  )

  const deleteAccount = useCallback(
    async (accountId: number) => {
      if (selectedAccountId === accountId) return
      await accountApi.deleteAccount(accountId)

      setAccounts((prev) => prev.filter((a) => a.id !== accountId))
    },
    [selectedAccountId]
  )

  return (
    <AccountContext.Provider
      value={{
        accounts,
        selectedAccount,
        loading,
        createAccount,
        setSelectedAccount,
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
