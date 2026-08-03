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
      <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr_auto] gap-4">
        <TransactionFilter />
        <div className="flex flex-1 flex-col overflow-auto">
          <div className="space-y-3">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date} className="flex flex-col gap-2">
                <div>{date}</div>
                <div className="space-y-3">
                  {items.map((transaction) => (
                    <ContextMenu key={transaction.id}>
                      <ContextMenuTrigger asChild>
                        <Card className="gap-2">
                          <CardHeader>
                            <CardTitle>{transaction.account.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-[1fr_auto] gap-1">
                            <div className="flex flex-col justify-center gap-1">
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
                          </CardContent>
                        </Card>
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
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <Pagination />
        </div>
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
