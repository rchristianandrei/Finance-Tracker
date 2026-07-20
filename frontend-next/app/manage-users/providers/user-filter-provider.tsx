"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react"

interface UserFilterContextType {
  search: string
  currentPage: number
  changeSearch: (value: string) => void
  goToPage: (page: number) => void
}

const UserFilterContext = createContext<UserFilterContextType | undefined>(
  undefined
)

export function UserFilterProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const searchKey = "search"
  const pageKey = "page"

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    console.log("URL changed:", pathname, searchParams.toString())
  }, [pathname, searchParams, router])

  const navigate = useCallback(
    (filter: { search?: string; page?: number | undefined | null }) => {
      const params = new URLSearchParams(searchParams.toString())

      if (filter.search) {
        params.set(searchKey, filter.search.toString())
      } else if (filter.search === "") {
        params.delete(searchKey)
      }

      if (filter.page) {
        params.set(pageKey, filter.page.toString())
      } else if (filter.page === null) {
        params.delete(pageKey)
      }

      const url = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname

      console.log("replace:", url)

      router.push(url)

      setTimeout(() => {
        console.log(window.location.href)
      }, 100)
    },
    [searchParams, pathname, router]
  )

  // Search
  const search = useMemo(
    () => searchParams.get(searchKey) ?? "",
    [searchParams]
  )

  const changeSearch = useCallback(
    (value: string) => {
      navigate({
        search: value.trim(),
      })
    },
    [navigate]
  )

  // Page
  const currentPage = useMemo(() => {
    const page = searchParams.get(pageKey)
    return page ? Number(page) : 1
  }, [searchParams])

  const goToPage = useCallback(
    (newPage: number) => {
      navigate({
        page: newPage,
      })
    },
    [navigate]
  )

  return (
    <UserFilterContext.Provider
      value={{
        search,
        currentPage,
        changeSearch,
        goToPage,
      }}
    >
      {children}
    </UserFilterContext.Provider>
  )
}

export function useUserFilter() {
  const context = useContext(UserFilterContext)

  if (!context) {
    throw new Error("useUserFilter must be used within an UserFilterProvider")
  }

  return context
}
