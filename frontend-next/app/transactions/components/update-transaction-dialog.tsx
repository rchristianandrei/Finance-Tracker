"use client"

import { Transaction } from "@/types/transaction"
import { NewCreateTransactionDialog } from "@/components/transaction/new-create-transaction-dialog"

export function UpdateTransactionDialog({
  transaction,
  onClose,
}: {
  transaction: Transaction
  onClose: () => void
}) {
  return (
    <>
      <NewCreateTransactionDialog
        title="Update Transaction"
        hideTrigger
        initialOpen={true}
        initialTransaction={transaction}
        onClose={onClose}
      />
    </>
  )
}
