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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import axios from "axios"
import { FieldError } from "@/components/ui/field"
import { Transaction } from "@/types/transaction"

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
        <TooltipProvider>
          <AlertDialogContent className="w-[95vw] max-w-xl!">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Transaction</AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to delete this transaction? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-3 rounded-md border p-4 text-sm">
              <div className="flex flex-wrap justify-between">
                <span className="font-medium">Description</span>

                <Tooltip>
                  <TooltipTrigger className="max-w-50 truncate">
                    {transaction.description}
                  </TooltipTrigger>
                  <TooltipContent>{transaction.description}</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex flex-wrap justify-between">
                <span className="font-medium">Amount</span>
                <span
                  className={
                    transaction.type === 2 ? "text-green-600" : "text-red-600"
                  }
                >
                  {transaction.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-wrap justify-between">
                <span className="font-medium">Type</span>
                <span className="capitalize">
                  {transaction.type === 1 ? "Expense" : "Income"}
                </span>
              </div>

              <div className="flex flex-wrap justify-between">
                <span className="font-medium">Category</span>
                <Tooltip>
                  <TooltipTrigger className="max-w-50 truncate">
                    {transaction.category.name}
                  </TooltipTrigger>
                  <TooltipContent>{transaction.category.name}</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex flex-wrap justify-between">
                <span className="font-medium">Date</span>
                <span>{transaction.date.toDateString()}</span>
              </div>
            </div>

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
                className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </TooltipProvider>
      )}
    </AlertDialog>
  )
}
