"use client"

import { toast } from "sonner"
import { Dialog } from "@/components/ui/dialog"
import { CategoryFormValues } from "@/lib/validations/category"
import { useManageCategories } from "../providers/manage-category-provider"
import { CategoryForm } from "../../../components/category/category-form"
import axios from "axios"
import { useEffect, useState } from "react"

export function UpdateCategoryDialog() {
  const {
    updateCategoryEvent,
    cancelUpdateCategoryEvent,
    confirmUpdateCategoryEvent,
  } = useManageCategories()

  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (updateCategoryEvent) return
    setErrorMessage("")
  }, [updateCategoryEvent])

  async function onSubmit(values: CategoryFormValues) {
    if (!updateCategoryEvent) return
    setErrorMessage("")
    try {
      await confirmUpdateCategoryEvent({
        ...updateCategoryEvent,
        type: values.type === "1" ? 1 : 2,
        name: values.name,
      })

      toast.success("Category updated successfully")
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
    <Dialog
      open={updateCategoryEvent != null}
      onOpenChange={() => {
        cancelUpdateCategoryEvent()
      }}
    >
      {updateCategoryEvent && (
        <CategoryForm
          title="Update Category"
          category={updateCategoryEvent}
          errorMessage={errorMessage}
          onSave={onSubmit}
        ></CategoryForm>
      )}
    </Dialog>
  )
}
