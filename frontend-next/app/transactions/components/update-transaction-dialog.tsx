"use client"

import { TransactionFormValues } from "@/lib/validations/transaction"
import { toast } from "sonner"
import { TransactionForm } from "@/components/transaction-form"
import { useManageTransactions } from "../providers/manage-transactions-provider"
import { Dialog } from "@/components/ui/dialog"
import { Transaction } from "@/types/transaction"
import { useState } from "react"
import { CreateCategoryDialog } from "@/components/category/create-category-dialog"

export function UpdateTransactionDialog({
  transaction,
  onClose,
}: {
  transaction: Transaction
  onClose: () => void
}) {
  const { updateTransaction } = useManageTransactions()
  const [isOpen, setIsOpen] = useState(true)
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] =
    useState(false)

  async function onSubmit(values: TransactionFormValues) {
    if (!transaction) return
    try {
      await updateTransaction({
        ...transaction,
        categoryId: values.categoryId,
        description: values.description,
        amount: values.amount,
        date: values.date,
      })

      toast.success("Transaction updated successfully")
      onClose()
    } catch (err) {
      toast.error("Failed to update transaction")
    }
  }

  return (
    <>
      <Dialog
        open={isOpen && transaction != null}
        onOpenChange={(value) => {
          setIsOpen(value)
          onClose()
        }}
      >
        {transaction && (
          <TransactionForm
            title="Update Transaction"
            transaction={transaction}
            onSave={onSubmit}
            onAddCategoryClick={() => {
              setIsOpen(false)
              setIsCreateCategoryDialogOpen(true)
            }}
          ></TransactionForm>
        )}
      </Dialog>
      {isCreateCategoryDialogOpen && (
        <CreateCategoryDialog
          onClose={() => {
            setIsCreateCategoryDialogOpen(false)
            setIsOpen(true)
          }}
        />
      )}
    </>
  )
}
