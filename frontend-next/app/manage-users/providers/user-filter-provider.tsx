"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { createContext, useCallback, useContext, useMemo } from "react"

interface UserFilterContextType {
  currentPage: number
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
  const pageKey = "page"

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigate = useCallback(
    (filter: { page: number | undefined | null }) => {
      const params = new URLSearchParams(searchParams.toString())

      if (filter.page) {
        params.set(pageKey, filter.page.toString())
      } else if (filter.page === null) {
        params.delete(pageKey)
      }

      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname]
  )

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
        currentPage,
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
