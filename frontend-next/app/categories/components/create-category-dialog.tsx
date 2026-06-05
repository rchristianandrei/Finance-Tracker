"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Plus } from "lucide-react"

import { useAccount } from "@/providers/account-provider"
import { toast } from "sonner"
import { CategoryForm } from "./category-form"
import { CategoryFormValues } from "@/lib/validations/category"

export function CreateCategoryDialog() {
  const { selectedAccount } = useAccount()

  async function onSubmit(values: CategoryFormValues) {
    if (!selectedAccount) return
    try {
      toast.success("Category created successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to create category")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Add Category
        </Button>
      </DialogTrigger>

      <CategoryForm title="Create Category" onSave={onSubmit} />
    </Dialog>
  )
}
