"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CircleDollarSign,
  Receipt,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"]

const transactions = [
  {
    id: 1,
    description: "Salary",
    category: "Job",
    type: "income",
    amount: 50000,
    date: "2026-05-01",
  },
  {
    id: 2,
    description: "Groceries",
    category: "Food",
    type: "expense",
    amount: 3500,
    date: "2026-05-02",
  },
  {
    id: 3,
    description: "Freelance",
    category: "Side Hustle",
    type: "income",
    amount: 12000,
    date: "2026-05-05",
  },
  {
    id: 4,
    description: "Electric Bill",
    category: "Utilities",
    type: "expense",
    amount: 2800,
    date: "2026-05-08",
  },
  {
    id: 5,
    description: "Transportation",
    category: "Transport",
    type: "expense",
    amount: 1500,
    date: "2026-05-10",
  },
  {
    id: 6,
    description: "Transportation",
    category: "Transport",
    type: "expense",
    amount: 1500,
    date: "2026-05-10",
  },
  {
    id: 7,
    description: "Transportation",
    category: "Transport",
    type: "expense",
    amount: 1500,
    date: "2026-05-10",
  },
  {
    id: 8,
    description: "Transportation",
    category: "Transport",
    type: "expense",
    amount: 1500,
    date: "2026-05-10",
  },
]

const expenseCategories = [
  { name: "Food", value: 3500 },
  { name: "Utilities", value: 2800 },
  { name: "Transport", value: 1500 },
]

const incomeCategories = [
  { name: "Job", value: 50000 },
  { name: "Side Hustle", value: 12000 },
]

export default function DashboardPage() {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const balance = income - expenses

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
              {balance.toLocaleString()}
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
              {income.toLocaleString()}
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
              {expenses.toLocaleString()}
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
                  data={incomeCategories}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {incomeCategories.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
                  data={expenseCategories}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {expenseCategories.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* TRANSACTIONS */}
      <Card>
        <CardHeader className="flex items-center gap-2">
          <Receipt></Receipt>
          <CardTitle>This Month Transactions</CardTitle>
        </CardHeader>

        <CardContent className="md:flex-1 md:overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>

                  <TableCell>{transaction.category}</TableCell>

                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </TableCell>

                  <TableCell>{transaction.date}</TableCell>

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
