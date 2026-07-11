import api from "@/lib/axios"
import { TransactionType } from "@/types/category"
import { Transaction } from "@/types/transaction"

export const transactionApi = {
  createTransaction: async (expense: {
    category: string
    amount: number
    description: string
    date: Date
  }) => {
    const body = {
      ...expense,
      date: expense.date.toISOString(),
    }
    return await api.post<Transaction>(`/transaction`, body)
  },
  readTransactions: async (
    filter?: {
      search?: string
      startDate?: Date
      endDate?: Date
      page?: number
      type?: number
      categories?: string[]
    },
    signal?: AbortSignal
  ) => {
    let params = new URLSearchParams()

    if (filter?.search) {
      params.set("Search", filter.search)
    }

    if (filter?.type) {
      params.set("TransactionType", filter.type.toString())
    }

    if (filter?.categories) {
      filter.categories.forEach((c) => params.append("Categories", c))
    }

    if (filter?.startDate) {
      params.set("StartDate", filter.startDate.toISOString())
    }

    if (filter?.endDate) {
      params.set("EndDate", filter.endDate.toISOString())
    }

    if (filter?.page) {
      params.set("Page", filter.page.toString())
    }

    const response = await api.get<{
      totalCount: number
      data: Transaction[]
    }>(`/transaction`, { params, signal })

    response.data.data = response.data.data.map((t) => ({
      ...t,
      date: new Date(t.date),
    }))

    return response.data
  },
  update: (transaction: Transaction) => {
    const body = {
      ...transaction,
      date: transaction.date.toISOString(),
    }
    return api.put(`/transaction/${transaction.id}`, body)
  },
  delete: (id: number) => {
    return api.delete(`/transaction/${id}`)
  },
}
