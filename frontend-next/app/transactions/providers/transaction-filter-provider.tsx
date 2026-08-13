"use client"

import { useCategory } from "@/providers/category-provider"
import { Category } from "@/types/category"
import { format } from "date-fns"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { createContext, useCallback, useContext, useMemo } from "react"
import { DateRange } from "react-day-picker"

interface TransactionFilterContextType {
  search: string
  dateRange: DateRange | undefined
  type: string | null
  selectedAccounts: string[]
  selectedCategories: string[]
  filteredCategories: Category[]
  currentPage: number
  changeSearch: (value: string) => void
  changeType: (value: string) => void
  changeSelectedAccount: (accounts: string[]) => void
  changeSelectedCategory: (categories: string[]) => void
  changeDate: (range: DateRange | undefined) => void
  goToPage: (page: number) => void
  clearFilters: () => void
}

const TransactionFilterContext = createContext<
  TransactionFilterContextType | undefined
>(undefined)

export function TransactionFilterProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const searchKey = "search"
  const typeKey = "type"
  const accountKey = "account"
  const categoryKey = "category"
  const dateFromKey = "from"
  const dateToKey = "to"
  const pageKey = "page"

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { categories } = useCategory()

  const navigate = useCallback(
    (filter: {
      search?: string
      type?: string
      account?: string
      category?: string
      from?: string
      to?: string
      page?: number | null | undefined
    }) => {
      const params = new URLSearchParams(searchParams.toString())

      if (filter.search) {
        params.set(searchKey, filter.search)
      } else if (filter.search === "") {
        params.delete(searchKey)
      }

      if (filter.type) {
        params.set(typeKey, filter.type)
      } else if (filter.type === "") {
        params.delete(typeKey)
      }

      if (filter.account) {
        params.set(accountKey, filter.account)
      } else if (filter.account === "") {
        params.delete(accountKey)
      }

      if (filter.category) {
        params.set(categoryKey, filter.category)
      } else if (filter.category === "") {
        params.delete(categoryKey)
      }

      if (filter.from) {
        params.set(dateFromKey, filter.from)
      } else if (filter.from === "") {
        params.delete(dateFromKey)
      }

      if (filter.to) {
        params.set(dateToKey, filter.to)
      } else if (filter.to === "") {
        params.delete(dateToKey)
      }

      if (filter.page) {
        params.set(pageKey, filter.page.toString())
      } else if (filter.page === null) {
        params.delete(pageKey)
      }

      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  // Search
  const search = useMemo(
    () => searchParams.get(searchKey) ?? "",
    [searchParams]
  )

  const changeSearch = useCallback(
    (value: string) => {
      navigate({ search: value, page: null })
    },
    [navigate]
  )

  // Type
  const type = useMemo(() => {
    return searchParams.get(typeKey)
  }, [searchParams])

  const changeType = useCallback(
    (value: string) =>
      navigate({
        type: value === "all" ? "" : value,
        category: "",
        page: null,
      }),
    [navigate]
  )

  // Accounts
  const selectedAccounts = useMemo(() => {
    return searchParams.get(accountKey)?.split(",").filter(Boolean) ?? []
  }, [searchParams])

  const changeSelectedAccount = useCallback(
    (accounts: string[]) => {
      navigate({
        account: accounts.length > 0 ? accounts.join(",") : "",
        page: null,
      })
    },
    [navigate]
  )

  // Category
  const selectedCategories = useMemo(() => {
    return searchParams.get(categoryKey)?.split(",").filter(Boolean) ?? []
  }, [searchParams])

  const filteredCategories = useMemo(() => {
    if (!type) return categories

    return categories.filter(
      (c) => (c.type === 2 ? "income" : "expense") === type
    )
  }, [categories, type])

  const changeSelectedCategory = useCallback(
    (categories: string[]) => {
      navigate({
        category: categories.length > 0 ? categories.join(",") : "",
        page: null,
      })
    },
    [navigate]
  )

  // Page
  const currentPage = useMemo(() => {
    const page = searchParams.get(pageKey)
    return page ? Number(page) : 1
  }, [searchParams])

  const goToPage = (newPage: number) => {
    navigate({ page: newPage })
  }

  // Date
  const dateRange: DateRange | undefined = useMemo(() => {
    const from = searchParams.get(dateFromKey)
    const to = searchParams.get(dateToKey)

    if (!from && !to) return undefined

    return {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    }
  }, [searchParams])

  const changeDate = useCallback(
    (range: DateRange | undefined) => {
      navigate({
        from: range?.from
          ? format(range.from, "yyyy-MM-dd'T'00:00:00.000")
          : "",
        to: range?.to ? format(range.to, "yyyy-MM-dd'T'00:00:00.000") : "",
        page: null,
      })
    },
    [navigate]
  )

  const clearFilters = useCallback(() => {
    router.replace(pathname)
  }, [router, pathname])

  return (
    <TransactionFilterContext.Provider
      value={{
        search,
        dateRange,
        type,
        selectedAccounts,
        selectedCategories,
        filteredCategories,
        currentPage,
        changeSearch,
        changeType,
        changeSelectedAccount,
        changeSelectedCategory,
        changeDate,
        goToPage,
        clearFilters,
      }}
    >
      {children}
    </TransactionFilterContext.Provider>
  )
}

export function useTransactionFilter() {
  const context = useContext(TransactionFilterContext)

  if (!context) {
    throw new Error(
      "useTransactionFilter must be used within an TransactionFilterProvider"
    )
  }

  return context
}
