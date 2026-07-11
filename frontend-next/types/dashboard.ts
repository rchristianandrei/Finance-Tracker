export type CategorySummary = {
  category: string
  amount: number
  percentage: number
}

export type DashboardType = {
  totalIncome: number
  totalExpense: number
  netAmount: number
  incomeByCategory: CategorySummary[]
  expenseByCategory: CategorySummary[]
}
