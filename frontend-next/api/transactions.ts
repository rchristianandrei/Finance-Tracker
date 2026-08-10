import api from "@/lib/axios"
import { Transaction } from "@/types/transaction"

export type CreateIncomeTransactionRequest = {
  toAccountId: number
  categoryId: number
  amount: number
  description: string
  date: Date
}

export const transactionApi = {
  createTransaction: async (expense: {
    accountId: number
    categoryId: number
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
  createIncomeTransaction: async (income: CreateIncomeTransactionRequest) => {
    const body = {
      ...income,
      date: income.date.toISOString(),
    }
    return await api.post(`/transaction/income`, body)
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
  update: (updatedValues: {
    id: number
    date: Date
    accountId: number
    categoryId: number
    description: string
    amount: number
  }) => {
    const body = {
      ...updatedValues,
      date: updatedValues.date.toISOString(),
    }
    return api.put(`/transaction/${updatedValues.id}`, body)
  },
  delete: (id: number) => {
    return api.delete(`/transaction/${id}`)
  },
}
