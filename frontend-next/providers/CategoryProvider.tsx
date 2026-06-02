import { createContext, useContext, useEffect, useState } from "react"
import { Category } from "@/types/category"
import { useAccount } from "./AccountProvider"
import { categoryApi } from "@/api/category"

interface CategoryContextType {
  categories: Category[]
  loading: boolean
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
)

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const { selectedAccount } = useAccount()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      if (!selectedAccount) return

      try {
        const response = await categoryApi.getCategories(selectedAccount.id)
        const data = response.data

        setCategories(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [selectedAccount])

  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategory() {
  const context = useContext(CategoryContext)

  if (!context) {
    throw new Error("useCategory must be used within an CategoryProvider")
  }

  return context
}
