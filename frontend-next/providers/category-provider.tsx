import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { Category, TransactionType } from "@/types/category"
import { categoryApi } from "@/api/category"
import axios from "axios"
import { useAuth } from "./auth-provider"

interface CategoryContextType {
  categories: Category[]
  loading: boolean
  loadCategories: () => Promise<void>
  createCategory: (type: TransactionType, name: string) => Promise<void>
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
)

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const { loading: isLoggingIn } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoggingIn) return
    loadCategories()
  }, [isLoggingIn])

  const loadCategories = useCallback(async () => {
    try {
      const response = await categoryApi.getCategories()
      const data = response.data

      setCategories(data)
    } catch (err) {
      if (axios.isCancel(err)) return
    } finally {
      setLoading(false)
    }
  }, [])

  const createCategory = useCallback(
    async (type: TransactionType, name: string) => {
      await categoryApi.create(type, name)
      await loadCategories()
    },
    []
  )

  return (
    <CategoryContext.Provider
      value={{ categories, loading, loadCategories, createCategory }}
    >
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
