"use client"

import { useCategory } from "@/providers/category-provider"
import { Category } from "@/types/category"
import { format } from "date-fns"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { createContext, useCallback, useContext, useMemo } from "react"
import { DateRange } from "react-day-picker"
import { DebouncedState, useDebouncedCallback } from "use-debounce"

interface TransactionFilterContextType {
  search: string
  dateRange: DateRange | undefined
  type: string | null
  selectedCategories: string[]
  filteredCategories: Category[]
  currentPage: number
  changeSearch: DebouncedState<(value: string) => void>
  changeType: (value: string) => void
  changeSelectedCategory: (categoryName: string, checked: boolean) => void
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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { categories } = useCategory()

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

      console.log("createQueryString result:", params.toString())
      return params.toString()
    },
    [searchParams]
  )

  const navigate = useCallback(
    (updates: Record<string, string | undefined>) => {
      const qs = createQueryString(updates)
      console.log("navigating to:", `${pathname}?${qs}`)
      router.replace(`${pathname}?${qs}`)
    },
    [router, pathname, createQueryString]
  )

  const search = useMemo(() => searchParams.get("search") ?? "", [searchParams])

  const changeSearch = useDebouncedCallback((value: string) => {
    navigate({
      search: value || undefined,
    })
  }, 500)

  const type = useMemo(() => {
    return searchParams.get("type")
  }, [searchParams])

  const changeType = (value: string) =>
    navigate({
      type: value === "all" ? undefined : value,
      category: undefined,
      page: undefined,
    })

  const selectedCategories = useMemo(() => {
    return searchParams.get("category")?.split(",").filter(Boolean) ?? []
  }, [searchParams])

  const filteredCategories = useMemo(() => {
    if (!type) return categories

    return categories.filter(
      (c) => (c.type === 2 ? "income" : "expense") === type
    )
  }, [categories, type])

  const changeSelectedCategory = useCallback(
    (categoryName: string, checked: boolean) => {
      let next: string[]

      if (categoryName === "all") {
        next = []
      } else {
        next = checked
          ? [...selectedCategories, categoryName]
          : selectedCategories.filter((c) => c !== categoryName)
      }

      if (next.length === filteredCategories.length) {
        next = []
      }

      navigate({
        category: next.length > 0 ? next.join(",") : undefined,
      })
    },
    [selectedCategories, filteredCategories]
  )

  const currentPage = useMemo(() => {
    const page = searchParams.get("page")
    return page ? Number(page) : 1
  }, [searchParams])

  const dateRange: DateRange | undefined = useMemo(() => {
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!from && !to) return undefined

    return {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    }
  }, [searchParams])

  const changeDate = (range: DateRange | undefined) => {
    navigate({
      page: "1",
      from: range?.from
        ? format(range.from, "yyyy-MM-dd'T'00:00:00.000")
        : undefined,

      to: range?.to ? format(range.to, "yyyy-MM-dd'T'00:00:00.000") : undefined,
    })
  }

  const goToPage = (newPage: number) => {
    navigate({
      page: String(newPage),
    })
  }

  const clearFilters = () => {
    router.replace(pathname)
  }

  return (
    <TransactionFilterContext.Provider
      value={{
        search,
        dateRange,
        type,
        selectedCategories,
        filteredCategories,
        currentPage,
        changeSearch,
        changeType,
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
