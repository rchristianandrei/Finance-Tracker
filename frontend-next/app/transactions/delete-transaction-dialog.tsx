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
import { useManageTransactions } from "./providers/manage-transactions-provider"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import axios from "axios"
import { FieldError } from "@/components/ui/field"

export function DeleteTransactionDialog() {
  const {
    deleteTransactionEvent,
    cancelDeleteTransactionEvent,
    confirmDeleteTransactionEvent,
  } = useManageTransactions()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const onCancel = () => {
    cancelDeleteTransactionEvent()
  }

  const onConfirm = async () => {
    setIsLoading(true)
    try {
      await confirmDeleteTransactionEvent()
    } catch (error) {
      if (axios.isAxiosError(error)) return
      setErrorMessage("Unable to delete the transaction")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={deleteTransactionEvent !== null}>
      {deleteTransactionEvent && (
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
                    {deleteTransactionEvent.description}
                  </TooltipTrigger>
                  <TooltipContent>
                    {deleteTransactionEvent.description}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex flex-wrap justify-between">
                <span className="font-medium">Amount</span>
                <span
                  className={
                    deleteTransactionEvent.type === 2
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  ₱{deleteTransactionEvent.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-wrap justify-between">
                <span className="font-medium">Type</span>
                <span className="capitalize">
                  {deleteTransactionEvent.type === 1 ? "Expense" : "Income"}
                </span>
              </div>

              <div className="flex flex-wrap justify-between">
                <span className="font-medium">Category</span>
                <Tooltip>
                  <TooltipTrigger className="max-w-50 truncate">
                    {deleteTransactionEvent.category}
                  </TooltipTrigger>
                  <TooltipContent>
                    {deleteTransactionEvent.category}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex flex-wrap justify-between">
                <span className="font-medium">Date</span>
                <span>{deleteTransactionEvent.date.toDateString()}</span>
              </div>
            </div>

            {errorMessage && (
              <FieldError className="text-center">{errorMessage}</FieldError>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading} onClick={onCancel}>
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
