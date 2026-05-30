import api from "@/lib/axios"
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
}
