import api from "@/lib/axios"
import { DashboardType } from "@/types/dashboard"

export const reportsApi = {
  getDashboard: () => {
    return api.get<DashboardType>("/user/dashboard")
  },
}
