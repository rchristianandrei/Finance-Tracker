"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BanknoteArrowDown } from "lucide-react"
import { useMemo } from "react"
import { useDashboard } from "../providers/dashboard-provider"
import { HorizontalBarGraph } from "./horizontal-bar-graph"

export function ExpenseByCategory() {
  const { dashboardData } = useDashboard()
  const sortedExpenseCategories = useMemo(() => {
    return dashboardData?.expenseByCategory.sort((a, b) => b.amount - a.amount)
  }, [dashboardData])
  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <BanknoteArrowDown></BanknoteArrowDown>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>

      <CardContent>
        <HorizontalBarGraph
          categorySummaries={sortedExpenseCategories || []}
          type="expense"
        />
      </CardContent>
    </Card>
  )
}
