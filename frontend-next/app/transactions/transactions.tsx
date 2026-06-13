"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionFilter } from "./transaction-filter"
import { Edit, EllipsisVertical, Receipt, Trash } from "lucide-react"
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
import { Transaction } from "@/types/transaction"
import { formatDate } from "@/lib/format-date"
import { useMemo } from "react"

export function Transactions() {
  const { transactions, setUpdateTransactionEvent, setDeleteTransactionEvent } =
    useManageTransactions()

  const grouped = useMemo(
    () =>
      transactions.reduce<Record<string, Transaction[]>>((acc, item) => {
        const date = item.date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })

        if (!acc[date]) {
          acc[date] = []
        }

        acc[date].push(item)
        return acc
      }, {}),
    [transactions]
  )

  const onUpdateClick = (transaction: Transaction) => {
    setUpdateTransactionEvent(transaction)
  }

  const onDeleteClick = (transaction: Transaction) => {
    setDeleteTransactionEvent(transaction)
  }

  return (
    <div className="flex flex-col gap-4">
      <TransactionFilter />
      <Card className="flex flex-1 flex-col overflow-auto">
        <CardHeader className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Receipt></Receipt>
            <CardTitle>Transactions</CardTitle>
          </div>
          <Pagination />
        </CardHeader>

        <CardContent className="space-y-3">
          <TooltipProvider>
            {Object.entries(grouped).map(([date, items]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle>{date}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((transaction) => (
                    <div key={transaction.id} className="flex items-center">
                      <div className="grid flex-1 grid-cols-2">
                        <div className="max-w-50">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block cursor-help truncate text-muted-foreground">
                                {transaction.category}
                              </span>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>{transaction.category}</p>
                            </TooltipContent>
                          </Tooltip>
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
                        </div>
                        <div className="flex flex-row items-center gap-1 justify-self-end">
                          <div className="flex flex-col text-right">
                            <span className="text-muted-foreground">
                              {transaction.date.toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                            <span
                              className={cn(
                                `rounded-full px-2 py-1 text-xs font-medium`,
                                transaction.type === 2
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              )}
                            >
                              {transaction.amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-fit"
                          side={"bottom"}
                          align="end"
                          sideOffset={4}
                        >
                          <DropdownMenuItem
                            onClick={() => onUpdateClick(transaction)}
                          >
                            <Edit />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteClick(transaction)}
                          >
                            <Trash /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  )
}
