"use client"

import axios from "axios"
import { toast } from "sonner"

import { Dialog } from "@/components/ui/dialog"
import { useAccount } from "@/providers/account-provider"
import { CategoryFormValues } from "@/lib/validations/category"

import { useState } from "react"
import { useCategory } from "@/providers/category-provider"
import { CategoryForm } from "./category-form"

export function CreateCategoryDialog({ onClose }: { onClose: () => void }) {
  const { selectedAccount } = useAccount()
  const { createCategory } = useCategory()

  const [errorMessage, setErrorMessage] = useState("")

  function onOpenDialogChange(open: boolean) {
    if (open) return
    setErrorMessage("")
    onClose()
  }

  async function onSubmit(values: CategoryFormValues) {
    if (!selectedAccount) return
    setErrorMessage("")
    try {
      await createCategory(values.type === "1" ? 1 : 2, values.name)
      toast.success("Category created successfully")
      setErrorMessage("")
      onClose()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data ?? err.message
        setErrorMessage(message)
      }
      throw err
    }
  }

  return (
    <Dialog open={true} onOpenChange={onOpenDialogChange}>
      <CategoryForm
        title="Create Category"
        errorMessage={errorMessage}
        onSave={onSubmit}
      />
    </Dialog>
  )
}
