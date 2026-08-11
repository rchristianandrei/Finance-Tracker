"use client"

import { Transaction } from "@/types/transaction"
import { useState } from "react"
import { CreateCategoryDialog } from "@/components/category/create-category-dialog"
import { NewCreateTransactionDialog } from "@/components/transaction/new-create-transaction-dialog"

export function UpdateTransactionDialog({
  transaction,
  onClose,
}: {
  transaction: Transaction
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] =
    useState(false)

  return (
    <>
      <NewCreateTransactionDialog
        title="Update Transaction"
        hideTrigger
        initialOpen={true}
        initialTransaction={transaction}
        onClose={onClose}
      />
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
