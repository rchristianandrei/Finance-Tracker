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

interface ManageCategoriesContextType {
  updateCategoryEvent: Category | null
  deleteCategoryEvent: Category | null
  setUpdateCategoryEvent: Dispatch<SetStateAction<Category | null>>
  cancelUpdateCategoryEvent: () => void
  confirmUpdateCategoryEvent: (category: Category) => Promise<void>
  setDeleteCategoryEvent: Dispatch<SetStateAction<Category | null>>
  cancelDeleteCategoryEvent: () => void
  confirmDeleteCategoryEvent: () => Promise<void>
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

  const [deleteCategoryEvent, setDeleteCategoryEvent] =
    useState<Category | null>(null)

  const [updateCategoryEvent, setUpdateCategoryEvent] =
    useState<Category | null>(null)

  const confirmUpdateCategoryEvent = useCallback(
    async (category: Category) => {
      if (!updateCategoryEvent) return
      await categoryApi.update(category)
      setUpdateCategoryEvent(null)
      loadCategories()
    },
    [updateCategoryEvent]
  )

  const cancelUpdateCategoryEvent = useCallback(() => {
    setUpdateCategoryEvent(null)
  }, [])

  const confirmDeleteCategoryEvent = useCallback(async () => {
    if (!deleteCategoryEvent) return
    await categoryApi.delete(deleteCategoryEvent.id)
    setDeleteCategoryEvent(null)
    loadCategories()
  }, [deleteCategoryEvent])

  const cancelDeleteCategoryEvent = useCallback(() => {
    setDeleteCategoryEvent(null)
  }, [])

  return (
    <ManageCategoriesContext.Provider
      value={{
        updateCategoryEvent,
        deleteCategoryEvent,
        setUpdateCategoryEvent,
        setDeleteCategoryEvent,
        cancelUpdateCategoryEvent,
        confirmUpdateCategoryEvent,
        cancelDeleteCategoryEvent,
        confirmDeleteCategoryEvent,
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
