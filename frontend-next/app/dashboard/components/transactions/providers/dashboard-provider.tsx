"use client"

import { reportsApi } from "@/api/reports"
import { useAddTransaction } from "@/providers/add-transaction-provider"
import { useAuth } from "@/providers/auth-provider"
import { DashboardType } from "@/types/dashboard"
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"

interface DashboardContextType {
  month: Date
  dashboardData: DashboardType | null
  setMonth: Dispatch<SetStateAction<Date>>
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { transactionAdded } = useAddTransaction()
  const [month, setMonth] = useState<Date>(new Date())
  const [dashboardData, setDashboardData] = useState<DashboardType | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!user) return
      const startDate = new Date(month.getFullYear(), month.getMonth(), 1)
      const endDate = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      )
      const response = await reportsApi.getDashboard(startDate, endDate)
      setDashboardData(response.data)
    })()
  }, [user, transactionAdded, month])

  return (
    <DashboardContext.Provider
      value={{
        month,
        dashboardData,
        setMonth,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)

  if (!context) {
    throw new Error("useDashboard must be used within an DashboardProvider")
  }

  return context
}
