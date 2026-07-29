import api from "@/lib/axios"
import { Category, TransactionType } from "@/types/category"

export type CategoryUpdateRequest = {
  id: number
  type: TransactionType
  name: string
}

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
  update: (req: CategoryUpdateRequest) => {
    return api.put(`/category/${req.id}`, req)
  },
  delete: (categoryId: number) => {
    return api.delete(`/category/${categoryId}`)
  },
}
