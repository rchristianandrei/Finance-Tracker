"use client"

import { transactionApi } from "@/api/transactions"
import { useAccount } from "@/providers/account-provider"
import { Transaction } from "@/types/transaction"
import axios from "axios"
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
  type: string | null
  selectedCategories: string[]
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

  const type = useMemo(() => {
    return searchParams.get("type")
  }, [searchParams])

  const selectedCategories = useMemo(() => {
    return searchParams.get("category")?.split(",").filter(Boolean) ?? []
  }, [searchParams])

  const currentPage = useMemo(() => {
    const page = searchParams.get("page")
    return page ? Number(page) : 1
  }, [searchParams])

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      if (!selectedAccount) return

      const search = searchParams.get("search")

      let filter = {
        search: search ?? undefined,
        startDate: dateRange?.from ?? undefined,
        endDate: dateRange?.to ?? undefined,
        page: currentPage,
        type: type ? (type === "expense" ? 1 : 2) : undefined,
        categories: selectedCategories ?? undefined,
      }
      try {
        const transactionsData = await transactionApi.readTransactions(
          selectedAccount.id,
          filter,
          controller.signal
        )

        setTransactions(transactionsData.data)
        setTotalTransactions(transactionsData.totalCount)
      } catch (err) {
        if (axios.isCancel(err)) return
      } finally {
        setLoading(false)
      }
    })()

    return () => {
      controller.abort()
    }
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
        type,
        selectedCategories,
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
