"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo } from "react"
import { BanknoteArrowUp } from "lucide-react"
import { HorizontalBarGraph } from "./components/horizontal-bar-graph"
import { useDashboard } from "./providers/dashboard-provider"

export function IncomeByCategory() {
  const { dashboardData } = useDashboard()

  const sortedIncomeCategories = useMemo(() => {
    return dashboardData?.incomeByCategory.sort((a, b) => b.amount - a.amount)
  }, [dashboardData])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <BanknoteArrowUp></BanknoteArrowUp>
        <CardTitle>Income Categories</CardTitle>
      </CardHeader>

      <CardContent>
        <HorizontalBarGraph
          categorySummaries={sortedIncomeCategories || []}
          type="income"
        />
      </CardContent>
    </Card>
  )
}
