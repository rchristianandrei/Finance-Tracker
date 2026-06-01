"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionFilter } from "./transaction-filter"
import { Delete, Edit, Ellipsis, Receipt, Trash } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { Transaction } from "@/types/transaction"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { Pagination } from "./pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      date: new Date(),
      category: "Food",
      description: "Grocery shopping",
      type: 1,
      amount: 100,
    },
  ])

  const searchParams = useSearchParams()

  useEffect(() => {
    // runs whenever URL query changes
    console.log("URL changed:", searchParams.toString())
  }, [searchParams])

  return (
    <div className="flex h-full flex-col gap-4">
      <TransactionFilter categories={[{ id: "1", name: "Food" }]} />
      <Card className="flex flex-1 flex-col overflow-auto">
        <CardHeader className="flex flex-wrap justify-between gap-2">
          <div className="flex items-center gap-2">
            <Receipt></Receipt>
            <CardTitle>Transactions</CardTitle>
          </div>
          <Pagination />
        </CardHeader>

        <CardContent className="flex flex-1 flex-col overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TooltipProvider>
                {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date.toDateString()}</TableCell>

                    <TableCell className="max-w-50 truncate">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block cursor-help truncate">
                            {transaction.category}
                          </span>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>{transaction.category}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    <TableCell className="max-w-50 truncate font-medium">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block cursor-help truncate">
                            {transaction.description}
                          </span>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p>{transaction.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          `rounded-full px-2 py-1 text-xs font-medium`,
                          transaction.type === 2
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        )}
                      >
                        {transaction.type === 2 ? "Income" : "Expense"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right font-semibold">
                      {transaction.amount.toLocaleString()}
                    </TableCell>

                    <TableCell className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-fit"
                          side={"bottom"}
                          align="end"
                          sideOffset={4}
                        >
                          <DropdownMenuItem>
                            <Edit />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Trash /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TooltipProvider>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
