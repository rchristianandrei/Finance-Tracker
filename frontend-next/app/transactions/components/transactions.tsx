"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionFilter } from "./transaction-filter"
import { Edit, Receipt, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Pagination } from "./pagination"
import { useManageTransactions } from "../providers/manage-transactions-provider"
import { Transaction } from "@/types/transaction"
import { useMemo, useState } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { UpdateTransactionDialog } from "./update-transaction-dialog"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import { TransactionBadge } from "@/components/transaction/transcation-badge"
import { formatMoney } from "@/lib/format-money"

export function Transactions() {
  const { transactions } = useManageTransactions()

  const [updateTransaction, setUpdateTransaction] =
    useState<Transaction | null>(null)
  const [deleteTransaction, setDeleteTransaction] =
    useState<Transaction | null>(null)

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

  return (
    <>
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
            {Object.entries(grouped).map(([date, items]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle>{date}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((transaction) => (
                    <ContextMenu key={transaction.id}>
                      <ContextMenuTrigger asChild>
                        <div className="grid grid-cols-[1fr_auto] gap-1">
                          <div>
                            <div className="truncate">
                              {transaction.account.name}
                            </div>
                            <div className="truncate text-muted-foreground">
                              {transaction.category.name}
                            </div>
                            <div className="truncate">
                              {transaction.description}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <TransactionBadge
                              type={
                                transaction.type === 2 ? "income" : "expense"
                              }
                            >
                              {formatMoney(transaction.amount)}
                            </TransactionBadge>
                            <div className="text-muted-foreground">
                              {transaction.date.toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() => setUpdateTransaction(transaction)}
                        >
                          <Edit />
                          Edit
                        </ContextMenuItem>

                        <ContextMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setDeleteTransaction(transaction)
                          }}
                        >
                          <Trash /> Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
      {updateTransaction && (
        <UpdateTransactionDialog
          transaction={updateTransaction}
          onClose={() => setUpdateTransaction(null)}
        />
      )}
      {deleteTransaction && (
        <DeleteTransactionDialog
          transaction={deleteTransaction}
          onClose={() => setDeleteTransaction(null)}
        />
      )}
    </>
  )
}
