"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMoney } from "@/lib/format-money"
import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { useDashboard } from "../providers/dashboard-provider"

export function TransctionSummary() {
  const { dashboardData } = useDashboard()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="gap-1">
        <CardHeader className="flex items-center gap-2">
          <CircleDollarSign></CircleDollarSign>
          <CardTitle>Total Net Income</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-xl font-bold text-blue-600">
            {dashboardData ? formatMoney(dashboardData.netAmount) : ""}
          </p>
        </CardContent>
      </Card>

      <Card className="gap-1">
        <CardHeader className="flex items-center gap-2">
          <TrendingUp></TrendingUp>
          <CardTitle>Total Income</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-xl font-bold text-green-600">
            {dashboardData ? formatMoney(dashboardData.totalIncome) : ""}
          </p>
        </CardContent>
      </Card>

      <Card className="gap-1">
        <CardHeader className="flex items-center gap-2">
          <TrendingDown></TrendingDown>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-xl font-bold text-red-600">
            {dashboardData ? formatMoney(dashboardData.totalExpense) : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
