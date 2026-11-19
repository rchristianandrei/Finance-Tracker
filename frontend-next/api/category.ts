import api from "@/lib/axios"
import { Category, CategoryRaw } from "@/types/category"
import {
  transactionTypeMap,
  TransactionTypeRaw,
} from "@/types/transaction-type"

export type CategoryUpdateRequest = {
  id: number
  type: TransactionTypeRaw
  name: string
}

export const categoryApi = {
  create: async (type: TransactionTypeRaw, name: string) => {
    const body = {
      type,
      name,
    }
    const resp = await api.post<CategoryRaw>(`/category`, body)
    return {
      ...resp.data,
      type: transactionTypeMap[resp.data.type],
    } as Category
  },
  getCategories: async () => {
    const resp = await api.get<CategoryRaw[]>(`/category`)
    return resp.data.map(
      (raw) => ({ ...raw, type: transactionTypeMap[raw.type] }) as Category
    )
  },
  update: (req: CategoryUpdateRequest) => {
    return api.put(`/category/${req.id}`, req)
  },
  delete: (categoryId: number) => {
    return api.delete(`/category/${categoryId}`)
  },
}
