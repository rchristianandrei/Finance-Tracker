import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { Category, TransactionType } from "@/types/category"
import { useAccount } from "./account-provider"
import { categoryApi } from "@/api/category"
import axios from "axios"

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
  const { selectedAccount } = useAccount()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [selectedAccount])

  const loadCategories = useCallback(async () => {
    if (!selectedAccount) return

    try {
      const response = await categoryApi.getCategories(selectedAccount.id)
      const data = response.data

      setCategories(data)
    } catch (err) {
      if (axios.isCancel(err)) return
    } finally {
      setLoading(false)
    }
  }, [selectedAccount])

  const createCategory = useCallback(
    async (type: TransactionType, name: string) => {
      if (!selectedAccount) return
      await categoryApi.create(selectedAccount.id, type, name)
      await loadCategories()
    },
    [selectedAccount]
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
