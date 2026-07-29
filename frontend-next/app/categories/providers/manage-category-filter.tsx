"use client"

import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react"
import { Category } from "@/types/category"
import { categoryApi } from "@/api/category"
import { useCategory } from "@/providers/category-provider"

interface ManageCategoryFilterContextType {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
}

const ManageCategoryFilterContext = createContext<
  ManageCategoryFilterContextType | undefined
>(undefined)

export function ManageCategoryFilterProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [search, setSearch] = useState("")

  return (
    <ManageCategoryFilterContext.Provider value={{ search, setSearch }}>
      {children}
    </ManageCategoryFilterContext.Provider>
  )
}

export function useManageCategoryFilter() {
  const context = useContext(ManageCategoryFilterContext)

  if (!context) {
    throw new Error(
      "useManageCategoryFilter must be used within an ManageCategoryFilterProvider"
    )
  }

  return context
}
