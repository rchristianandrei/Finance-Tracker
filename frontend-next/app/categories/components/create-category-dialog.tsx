"use client"

import axios from "axios"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAccount } from "@/providers/account-provider"
import { useCategory } from "@/providers/category-provider"
import { CategoryFormValues } from "@/lib/validations/category"

import { CategoryForm } from "./category-form"
import { useState } from "react"

export function CreateCategoryDialog() {
  const { selectedAccount } = useAccount()
  const { createCategory } = useCategory()

  const [errorMessage, setErrorMessage] = useState("")

  function onOpenDialogChange(open: boolean) {
    if (open) return
    setErrorMessage("")
  }

  async function onSubmit(values: CategoryFormValues) {
    if (!selectedAccount) return
    setErrorMessage("")
    try {
      await createCategory(values.type === "1" ? 1 : 2, values.name)
      toast.success("Category created successfully")
      setErrorMessage("")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data ?? err.message
        setErrorMessage(message)
      }

      throw err
    }
  }

  return (
    <Dialog onOpenChange={onOpenDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Add Category
        </Button>
      </DialogTrigger>

      <CategoryForm
        title="Create Category"
        errorMessage={errorMessage}
        onSave={onSubmit}
      />
    </Dialog>
  )
}
