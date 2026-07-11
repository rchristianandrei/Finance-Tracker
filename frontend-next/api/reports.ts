import api from "@/lib/axios"
import { DashboardType } from "@/types/dashboard"

export const reportsApi = {
  getDashboard: (startDate?: Date, endDate?: Date) => {
    return api.get<DashboardType>("/transaction/dashboard", {
      params: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
    })
  },
}
