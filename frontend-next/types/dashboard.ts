export type AccountSummary = {
  accountId: number
  accountName: string
  amount: number
  percentage: number
}

export type DashboardType = {
  totalIncome: number
  totalExpense: number
  netAmount: number
  incomeByAccount: AccountSummary[]
  expenseByAccount: AccountSummary[]
}
