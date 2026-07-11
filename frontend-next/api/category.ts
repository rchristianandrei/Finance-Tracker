import api from "@/lib/axios"
import { Category, TransactionType } from "@/types/category"

export const categoryApi = {
  create: (type: TransactionType, name: string) => {
    const body = {
      type,
      name,
    }
    return api.post<Category>(`/category`, body)
  },
  getCategories: () => {
    return api.get<Category[]>(`/category`)
  },
  update: (category: Category) => {
    return api.put(`/category/${category.id}`, {
      id: category.id,
      type: category.type,
      name: category.name,
    })
  },
  delete: (categoryId: number) => {
    return api.delete(`/category/${categoryId}`)
  },
}
