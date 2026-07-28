"use client"

import { useDashboard } from "../providers/dashboard-provider"
import { MonthPicker } from "./month-picker"

export function DashboardFilter() {
  const { month, setMonth } = useDashboard()
  return (
    <div className="flex flex-col gap-2">
      <div>Transactions</div>
      <MonthPicker month={month} setMonth={setMonth} />
    </div>
  )
}
