export type DashboardType = {
  balance: number;
  income: number;
  expenses: number;
  expensesBreakdown: { key: string; value: number }[];
  transactions: { date: Date; category: string; description: string; amount: number }[];
};
