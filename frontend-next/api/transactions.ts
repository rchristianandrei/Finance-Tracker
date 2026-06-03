import api from "@/lib/axios"
import { TransactionType } from "@/types/category"
import { DashboardType } from "@/types/dashboard"
import { Transaction } from "@/types/transaction"

export const transactionApi = {
  getDashboard: async (accountId: number) => {
    const response = await api.get<DashboardType>(
      `/account/${accountId}/dashboard`
    )

    response.data.transactions = response.data.transactions.map((t) => ({
      ...t,
      date: new Date(t.date),
    }))

    return response as { data: DashboardType }
  },
  createTransaction: async (
    accountId: number,
    expense: {
      type: TransactionType
      category: string
      amount: number
      description: string
      date: Date
    }
  ) => {
    const body = {
      ...expense,
      date: expense.date.toISOString(),
      type: expense.type,
      accountId: accountId,
    }
    return await api.post(`/transaction`, body)
  },
  readTransactions: async (
    accountId: number,
    filter?: {
      search?: string
      startDate?: Date
      endDate?: Date
      page?: number
      type?: number
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
    }>(`/account/${accountId}/transactions`, { params, signal })

    response.data.data = response.data.data.map((t) => ({
      ...t,
      date: new Date(t.date),
    }))

    return response.data
  },
}
