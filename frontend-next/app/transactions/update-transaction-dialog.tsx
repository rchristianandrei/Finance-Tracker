"use client"

import { TransactionFormValues } from "@/lib/validations/transaction"
import { toast } from "sonner"
import { TransactionForm } from "@/components/transactionForm"
import { useManageTransactions } from "./providers/manage-transactions-provider"
import { Dialog } from "@/components/ui/dialog"

export function UpdateTransactionDialog() {
  const {
    updateTransactionEvent,
    cancelUpdateTransactionEvent,
    confirmUpdateTransactionEvent,
  } = useManageTransactions()

  async function onSubmit(values: TransactionFormValues) {
    if (!updateTransactionEvent) return
    try {
      await confirmUpdateTransactionEvent({
        ...updateTransactionEvent,
        type: values.type === "1" ? 1 : 2,
        category: values.category,
        description: values.description,
        amount: values.amount,
        date: values.date,
      })

      toast.success("Transaction updated successfully")
    } catch (err) {
      toast.error("Failed to update transaction")
    }
  }

  return (
    <Dialog
      open={updateTransactionEvent != null}
      onOpenChange={(value) => {
        cancelUpdateTransactionEvent()
      }}
    >
      {updateTransactionEvent && (
        <TransactionForm
          title="Update Transaction"
          transaction={updateTransactionEvent}
          onSave={onSubmit}
        ></TransactionForm>
      )}
    </Dialog>
  )
}
