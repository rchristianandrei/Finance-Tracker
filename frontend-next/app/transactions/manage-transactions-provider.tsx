"use client"

import { categoryApi } from "@/api/category"
import { transactionApi } from "@/api/transactions"
import { useAccount } from "@/providers/AccountProvider"
import { Category } from "@/types/category"
import { Transaction } from "@/types/transaction"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { DateRange } from "react-day-picker"

interface ManageTransactionsContextType {
  transactions: Transaction[]
  loading: boolean
  totalTransactions: number
  searchParams: URLSearchParams
  search: string
  dateRange: DateRange | undefined
  currentPage: number
  setSearch: (value: string) => void
  navigate: (updates: Record<string, string | undefined>) => void
  goToPage: (page: number) => void
  clearFilters: () => void
}

const ManageTransactionsContext = createContext<
  ManageTransactionsContextType | undefined
>(undefined)

export function ManageTransactionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { selectedAccount } = useAccount()

  const [search, setSearch] = useState(searchParams.get("search") ?? "")

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      if (!selectedAccount) return

      const search = searchParams.get("search")
      const type = searchParams.get("type")

      let filter = {
        search: search ?? undefined,
        startDate: dateRange?.from ?? undefined,
        endDate: dateRange?.to ?? undefined,
        page: currentPage,
        type: type ? (type === "expense" ? 1 : 2) : undefined,
      }
      try {
        const transactionsData = await transactionApi.readTransactions(
          selectedAccount.id,
          filter
        )

        setTransactions(transactionsData.data)
        setTotalTransactions(transactionsData.totalCount)
      } finally {
        setLoading(false)
      }
    })()
  }, [selectedAccount, searchParams])

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "")
  }, [searchParams])

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      if (params.get("page") === "1") {
        params.delete("page")
      }

      return params.toString()
    },
    [searchParams]
  )

  const navigate = (updates: Record<string, string | undefined>) => {
    router.replace(`${pathname}?${createQueryString(updates)}`)
  }

  const dateRange: DateRange | undefined = useMemo(() => {
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!from && !to) return undefined

    return {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    }
  }, [searchParams])

  const currentPage = useMemo(() => {
    const page = searchParams.get("page")
    return page ? Number(page) : 1
  }, [searchParams])

  const goToPage = (newPage: number) => {
    navigate({
      page: String(newPage),
    })
  }

  const clearFilters = () => {
    router.replace(pathname)
  }

  return (
    <ManageTransactionsContext.Provider
      value={{
        transactions,
        loading,
        totalTransactions,
        searchParams,
        search,
        dateRange,
        currentPage,
        setSearch,
        navigate,
        goToPage,
        clearFilters,
      }}
    >
      {children}
    </ManageTransactionsContext.Provider>
  )
}

export function useManageTransactions() {
  const context = useContext(ManageTransactionsContext)

  if (!context) {
    throw new Error(
      "useManageTransactions must be used within an ManageTransactionsProvider"
    )
  }

  return context
}
