"use client"

import axios from "axios"
import { toast } from "sonner"

import { CategoryFormValues } from "@/lib/validations/category"

import { useState } from "react"
import { useCategory } from "@/providers/category-provider"
import { CategoryForm } from "./category-form"
import { Sheet } from "@/components/ui/sheet"
import { ResponsiveSheetContent } from "@/components/ResponsiveSheetContent"

export function CreateCategorySheet({ onClose }: { onClose: () => void }) {
  const { createCategory } = useCategory()

  const [errorMessage, setErrorMessage] = useState("")

  function onOpenDialogChange(open: boolean) {
    if (open) return
    setErrorMessage("")
    onClose()
  }

  async function onSubmit(values: CategoryFormValues) {
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
    <Sheet open={true} onOpenChange={onOpenDialogChange}>
      <ResponsiveSheetContent>
        <CategoryForm
          title="Create Category"
          errorMessage={errorMessage}
          onSave={onSubmit}
        />
      </ResponsiveSheetContent>
    </Sheet>
  )
}
