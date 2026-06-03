"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionFilter } from "./transaction-filter"
import { Edit, Ellipsis, Receipt, Trash } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { Pagination } from "./pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useManageTransactions } from "./providers/manage-transactions-provider"

export function Transactions() {
  const { transactions } = useManageTransactions()

  return (
    <div className="flex h-full flex-col gap-4">
      <TransactionFilter />
      <Card className="flex flex-1 flex-col overflow-auto">
        <CardHeader className="flex flex-wrap items-center justify-between gap-2">
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
                      {transaction.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
