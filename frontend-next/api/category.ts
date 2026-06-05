import api from "@/lib/axios"
import { Category, TransactionType } from "@/types/category"

export const categoryApi = {
  create: (accountId: number, type: TransactionType, name: string) => {
    const body = {
      accountId,
      type,
      name,
    }
    return api.post<Category>(`/category`, body)
  },
  getCategories: (accountId: number) => {
    return api.get<Category[]>(`/account/${accountId}/categories`)
  },
  update: (category: Category) => {
    return api.put(`/category/${category.id}`, {
      id: category.id,
      type: category.type,
      name: category.name,
    })
  },
}
