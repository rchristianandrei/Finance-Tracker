"use client"

import { createContext, useCallback, useContext } from "react"
import { categoryApi, CategoryUpdateRequest } from "@/api/category"
import { useCategory } from "@/providers/category-provider"

interface ManageCategoriesContextType {
  updateCategory: (category: CategoryUpdateRequest) => Promise<void>
  deleteCategory: (categoryId: number) => Promise<void>
}

const ManageCategoriesContext = createContext<
  ManageCategoriesContextType | undefined
>(undefined)

export function ManageCategoriesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { loadCategories } = useCategory()

  const updateCategory = useCallback(
    async (category: CategoryUpdateRequest) => {
      await categoryApi.update(category)
      loadCategories()
    },
    []
  )

  const deleteCategory = useCallback(async (categoryId: number) => {
    await categoryApi.delete(categoryId)
    loadCategories()
  }, [])

  return (
    <ManageCategoriesContext.Provider
      value={{
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </ManageCategoriesContext.Provider>
  )
}

export function useManageCategories() {
  const context = useContext(ManageCategoriesContext)

  if (!context) {
    throw new Error(
      "useManageCategories must be used within an ManageCategoriesProvider"
    )
  }

  return context
}
