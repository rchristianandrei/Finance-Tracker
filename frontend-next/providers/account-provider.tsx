import { accountApi } from "@/api/account"
import { Account } from "@/types/account"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useAuth } from "./auth-provider"
import axios from "axios"

interface AccountContextType {
  accounts: Account[]
  selectedAccount: Account | null
  loading: boolean
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
        setSelectedAccountId(data.defaultAccount?.id || null)
      } catch (err) {
        if (axios.isCancel(err)) return
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  return (
    <AccountContext.Provider value={{ accounts, selectedAccount, loading }}>
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
