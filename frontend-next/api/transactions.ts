import api from "@/lib/axios"
import { TransactionType } from "@/types/category"
import { DashboardType } from "@/types/dashboard"

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
}
