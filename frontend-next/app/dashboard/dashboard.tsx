"use client"

import { transactionApi } from "@/api/transactions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAccount } from "@/providers/AccountProvider"
import { DashboardType } from "@/types/dashboard"
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CircleDollarSign,
  Receipt,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"

import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"]

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
  const { selectedAccount } = useAccount()
  const [dashboardData, setDashboardData] = useState<DashboardType | null>(null)

  useEffect(() => {
    if (!selectedAccount) return
    ;(async () => {
      const response = await transactionApi.getDashboard(selectedAccount.id)

      const data = response.data

      setDashboardData(data)
    })()
  }, [selectedAccount])

  return (
    <div className="flex h-full flex-col gap-4">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <CircleDollarSign></CircleDollarSign>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData ? dashboardData.balance.toLocaleString() : ""}
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
              {dashboardData ? dashboardData.income.toLocaleString() : ""}
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
              {dashboardData ? dashboardData.expenses.toLocaleString() : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* INCOME PIE */}
        <Card className="">
          <CardHeader className="flex items-center gap-2">
            <BanknoteArrowUp></BanknoteArrowUp>
            <CardTitle>Income Categories</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dashboardData?.incomeBreakdown || []}
                  dataKey="value"
                  nameKey="key"
                  outerRadius={110}
                  label
                >
                  {dashboardData?.incomeBreakdown.map((_, index) => (
                    <Cell
                      key={index}
                      fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* EXPENSE PIE */}
        <Card className="">
          <CardHeader className="flex items-center gap-2">
            <BanknoteArrowDown></BanknoteArrowDown>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dashboardData?.expensesBreakdown || []}
                  dataKey="value"
                  nameKey="key"
                  outerRadius={110}
                  label
                >
                  {dashboardData?.expensesBreakdown.map((_, index) => (
                    <Cell
                      key={index}
                      fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* TRANSACTIONS */}
      <Card className="h-full">
        <CardHeader className="flex items-center gap-2">
          <Receipt></Receipt>
          <CardTitle>This Month Transactions</CardTitle>
        </CardHeader>

        <CardContent className="md:flex-1 md:overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dashboardData?.transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.date.toDateString()}</TableCell>

                  <TableCell>{transaction.category}</TableCell>

                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        transaction.type === 2
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {transaction.type === 2 ? "Income" : "Expense"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    {transaction.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
