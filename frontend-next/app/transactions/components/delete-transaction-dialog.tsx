"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useManageTransactions } from "../providers/manage-transactions-provider"
import { useState } from "react"
import { FieldError } from "@/components/ui/field"
import { Transaction } from "@/types/transaction"
import { TransactionBadge } from "@/components/transaction/transcation-badge"
import { formatMoney } from "@/lib/format-money"
import { Card } from "@/components/ui/card"

export function DeleteTransactionDialog({
  transaction,
  onClose,
}: {
  transaction: Transaction
  onClose: () => void
}) {
  const { deleteTransaction } = useManageTransactions()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const onConfirm = async () => {
    setIsLoading(true)
    try {
      await deleteTransaction(transaction.id)
      onClose()
    } catch (error) {
      setErrorMessage("Unable to delete the transaction")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={transaction !== null}>
      {transaction && (
        <AlertDialogContent className="w-[95vw] max-w-xl!">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Card className="grid grid-cols-[auto_1fr] gap-2 p-4 text-sm">
            <span className="font-medium">Type</span>
            <span className="text-right capitalize">
              {transaction.type === 1
                ? "Expense"
                : transaction.type === 2
                  ? "Income"
                  : "Transfer"}
            </span>

            {transaction.fromAccount && (
              <>
                <span className="font-medium">From Account</span>
                <span className="truncate text-right">
                  {transaction.fromAccount?.name}
                </span>
              </>
            )}

            {transaction.toAccount && (
              <>
                <span className="font-medium">To Account</span>
                <span className="truncate text-right">
                  {transaction.toAccount?.name}
                </span>
              </>
            )}
            {transaction.category && (
              <>
                <span className="font-medium">Category</span>
                <span className="truncate text-right">
                  {transaction.category?.name}
                </span>
              </>
            )}

            <div className="font-medium">Description</div>
            <span className="truncate text-right">
              {transaction.description}
            </span>

            <div className="font-medium">Amount</div>
            <div className="text-right">
              <TransactionBadge
                type={
                  transaction.type === 2
                    ? "income"
                    : transaction.type === 1
                      ? "expense"
                      : "transfer"
                }
              >
                {formatMoney(transaction.amount)}
              </TransactionBadge>
            </div>

            <span className="font-medium">Date</span>
            <span className="text-right">
              {transaction.date.toDateString()}
            </span>
          </Card>

          {errorMessage && (
            <FieldError className="text-center">{errorMessage}</FieldError>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading} onClick={onClose}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault()
                onConfirm()
              }}
              className="bg-red-500! text-white hover:bg-red-500/90!"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  )
}
