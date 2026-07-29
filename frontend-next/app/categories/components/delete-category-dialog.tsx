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
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import axios from "axios"
import { FieldError } from "@/components/ui/field"
import { useManageCategories } from "../providers/manage-category-provider"
import { Category } from "@/types/category"
import { TransactionBadge } from "@/components/transaction/transcation-badge"

export function DeleteCategoryDialog({
  category,
  onClose,
}: {
  category: Category
  onClose: () => void
}) {
  const { deleteCategory } = useManageCategories()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const onConfirm = async () => {
    setIsLoading(true)
    setErrorMessage("")
    try {
      await deleteCategory(category.id)
      onClose()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data ?? error.message
        setErrorMessage(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <TooltipProvider>
        <AlertDialogContent className="w-[95vw] max-w-xl!">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 rounded-md border p-4 text-sm">
            <div className="flex flex-wrap justify-between">
              <span className="font-medium">Name</span>

              <Tooltip>
                <TooltipTrigger className="max-w-50 truncate">
                  {category.name}
                </TooltipTrigger>
                <TooltipContent>{category.name}</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-wrap justify-between">
              <span className="font-medium">Type</span>
              <span className="capitalize">
                <TransactionBadge
                  type={category.type === 1 ? "expense" : "income"}
                >
                  {category.type === 1 ? "Expense" : "Income"}
                </TransactionBadge>
              </span>
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
    </AlertDialog>
  )
}
