"use client"

import { TransactionFormValues } from "@/lib/validations/transaction"
import { toast } from "sonner"
import { TransactionForm } from "@/components/transaction-form"
import { useManageTransactions } from "../providers/manage-transactions-provider"
import { Dialog } from "@/components/ui/dialog"
import { Transaction } from "@/types/transaction"

export function UpdateTransactionDialog({
  transaction,
  onClose,
}: {
  transaction: Transaction
  onClose: () => void
}) {
  const { updateTransaction } = useManageTransactions()

  async function onSubmit(values: TransactionFormValues) {
    if (!transaction) return
    try {
      await updateTransaction({
        ...transaction,
        type: values.type === "1" ? 1 : 2,
        category: values.category,
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
    <Dialog open={transaction != null} onOpenChange={onClose}>
      {transaction && (
        <TransactionForm
          title="Update Transaction"
          transaction={transaction}
          onSave={onSubmit}
        ></TransactionForm>
      )}
    </Dialog>
  )
}
