"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Plus } from "lucide-react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { transactionSchema } from "@/lib/validations/transaction"
import { TransactionFormValues } from "@/lib/validations/transaction"
import { useEffect, useState } from "react"
import { TransactionType } from "@/types/category"
import { transactionApi } from "@/api/transactions"
import { useAccount } from "@/providers/account-provider"
import { toast } from "sonner"
import { TransactionForm } from "./transactionForm"

export function CreateTransactionDialog() {
  const { selectedAccount } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "1",
      category: "",
      description: "",
      amount: undefined,
      date: undefined,
    },
  })

  const selectedType = form.watch("type")

  useEffect(() => {
    form.resetField("category")
  }, [selectedType])

  async function onSubmit(values: TransactionFormValues) {
    if (isSubmitting) return
    setIsSubmitting(true)
    if (!selectedAccount) return
    try {
      await transactionApi.createTransaction(selectedAccount.id, {
        type: Number(values.type) as TransactionType,
        category: values.category,
        description: values.description,
        amount: values.amount!,
        date: new Date(values.date),
      })

      toast.success("Transaction created successfully")
      form.reset()
    } catch (err) {
      console.error(err)
      toast.error("Failed to create transaction")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus></Plus>{" "}
          <span className="hidden md:inline">Add Transaction</span>
        </Button>
      </DialogTrigger>

      <TransactionForm title="Create Transaction" onSave={onSubmit} />
    </Dialog>
  )
}
