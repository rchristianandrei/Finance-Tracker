"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionFilter } from "./transaction-filter"
import { Edit, Trash } from "lucide-react"
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
              <Card key={date} className="flex flex-col gap-2">
                <CardHeader>
                  <CardTitle>{date}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((transaction) => (
                    <ContextMenu key={transaction.id}>
                      <ContextMenuTrigger asChild>
                        <Card className="gap-2">
                          <CardHeader className="grid grid-cols-[1fr_auto] gap-1">
                            <CardTitle className="truncate">
                              {transaction.description ?? "No description"}
                            </CardTitle>
                            <TransactionBadge
                              type={
                                transaction.type === 2 ? "income" : "expense"
                              }
                            >
                              {formatMoney(transaction.amount)}
                            </TransactionBadge>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-1 text-muted-foreground">
                            <div className="grid grid-cols-[1fr_auto_1fr] gap-1">
                              <div className="truncate">
                                {transaction.type === 2
                                  ? transaction.category?.name
                                  : transaction.fromAccount?.name}
                              </div>
                              <div>→</div>
                              <div className="truncate text-right">
                                {transaction.type === 2
                                  ? transaction.toAccount?.name
                                  : transaction.category?.name}
                              </div>
                            </div>
                            <div className="grid grid-cols-[1fr_auto] gap-1">
                              <div className="truncate">
                                {/* {transaction.category?.name} */}
                              </div>
                              <div>
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
                </CardContent>
              </Card>
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
