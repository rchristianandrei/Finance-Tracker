import api from "@/lib/axios"
import { Category } from "@/types/category"

export const categoryApi = {
  getCategories: (accountId: number) => {
    return api.get<Category[]>(`/account/${accountId}/categories`)
  },
}
