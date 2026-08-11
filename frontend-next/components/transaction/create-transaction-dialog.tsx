"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Plus } from "lucide-react"

import { TransactionFormValues } from "@/lib/validations/transaction"
import { transactionApi } from "@/api/transactions"
import { toast } from "sonner"
import { TransactionForm } from "./transaction-form"
import { useAddTransaction } from "@/providers/add-transaction-provider"
import { useState } from "react"
import { CreateCategoryDialog } from "../category/create-category-dialog"

export function CreateTransactionDialog() {
  const { addExpenseTransaction: addTransaction } = useAddTransaction()
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] =
    useState(false)

  async function onSubmit(values: TransactionFormValues) {
    try {
      await transactionApi.createTransaction({
        accountId: values.accountId,
        categoryId: values.categoryId,
        description: values.description,
        amount: values.amount!,
        date: new Date(values.date),
      })

      toast.success("Transaction created successfully")
      addTransaction()
      setIsOpen(false)
    } catch (err) {
      toast.error("Failed to create transaction")
      throw err
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus></Plus>{" "}
            <span className="hidden md:inline">Add Transaction</span>
          </Button>
        </DialogTrigger>

        <TransactionForm
          title="Create Transaction"
          onSave={onSubmit}
          onAddCategoryClick={() => {
            setIsOpen(false)
            setIsCreateCategoryDialogOpen(true)
          }}
        />
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
