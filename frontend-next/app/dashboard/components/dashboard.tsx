"use client"

import { reportsApi } from "@/api/reports"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"
import { DashboardType } from "@/types/dashboard"
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { CategoryPieChart } from "./category-pie-chart"
import { useAddTransaction } from "@/providers/add-transaction-provider"
import { MonthPicker } from "./month-picker"
import { VerticalBarGraph } from "./vertical-bar-graph"
import { formatMoney } from "@/lib/format-money"

const INCOME_COLORS = [
  "#166534", // green-800
  "#15803d", // green-700
  "#16a34a", // green-600
  "#22c55e", // green-500
  "#4ade80", // green-400
  "#86efac", // green-300
]

const EXPENSE_COLORS = [
  "#991b1b", // red-800
  "#b91c1c", // red-700
  "#dc2626", // red-600
  "#ef4444", // red-500
  "#f87171", // red-400
  "#fca5a5", // red-300
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { transactionAdded } = useAddTransaction()
  const [month, setMonth] = useState<Date>(new Date())
  const [dashboardData, setDashboardData] = useState<DashboardType | null>(null)

  const sortedIncomeCategories = useMemo(() => {
    return dashboardData?.incomeByCategory.sort((a, b) => b.amount - a.amount)
  }, [dashboardData])

  const sortedExpenseCategories = useMemo(() => {
    return dashboardData?.expenseByCategory.sort((a, b) => b.amount - a.amount)
  }, [dashboardData])

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
    <div className="flex flex-col gap-4">
      <MonthPicker month={month} setMonth={setMonth} />
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <CircleDollarSign></CircleDollarSign>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData ? formatMoney(dashboardData.netAmount) : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <TrendingUp></TrendingUp>
            <CardTitle>Total Income</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {dashboardData ? formatMoney(dashboardData.totalIncome) : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <TrendingDown></TrendingDown>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {dashboardData ? formatMoney(dashboardData.totalExpense) : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* INCOME PIE */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <BanknoteArrowUp></BanknoteArrowUp>
            <CardTitle>Income Categories</CardTitle>
          </CardHeader>

          <CardContent>
            <div>
              <CategoryPieChart
                transactionBreakdown={sortedIncomeCategories || []}
                cellColors={INCOME_COLORS}
              />
            </div>
            <div>
              <VerticalBarGraph
                categorySummaries={sortedIncomeCategories || []}
                type="income"
              />
            </div>
          </CardContent>
        </Card>

        {/* EXPENSE PIE */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <BanknoteArrowDown></BanknoteArrowDown>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>

          <CardContent>
            <div>
              <CategoryPieChart
                transactionBreakdown={sortedExpenseCategories || []}
                cellColors={EXPENSE_COLORS}
              />
            </div>
            <div>
              <VerticalBarGraph
                categorySummaries={sortedExpenseCategories || []}
                type="expense"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
