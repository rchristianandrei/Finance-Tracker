"use client"

import { toast } from "sonner"
import { CategoryFormValues } from "@/lib/validations/category"
import { useManageCategories } from "../providers/manage-category-provider"
import { CategoryForm } from "@/components/category/category-form"
import axios from "axios"
import { useState } from "react"
import { Category } from "@/types/category"
import { Sheet } from "@/components/ui/sheet"

export function UpdateCategorySheet({
  category,
  onClose,
}: {
  category: Category
  onClose: () => void
}) {
  const { updateCategory } = useManageCategories()
  const [errorMessage, setErrorMessage] = useState("")

  async function onSubmit(values: CategoryFormValues) {
    setErrorMessage("")
    try {
      await updateCategory({
        id: category.id,
        type: values.type === "1" ? 1 : 2,
        name: values.name,
      })

      toast.success("Category updated successfully")
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
    <Sheet
      open={true}
      onOpenChange={() => {
        onClose()
      }}
    >
      <CategoryForm
        title="Update Category"
        category={category}
        errorMessage={errorMessage}
        onSave={onSubmit}
      ></CategoryForm>
    </Sheet>
  )
}
