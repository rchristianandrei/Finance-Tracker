"use client"

import { toast } from "sonner"
import { Dialog } from "@/components/ui/dialog"
import { CategoryFormValues } from "@/lib/validations/category"
import { useManageCategories } from "../providers/manage-category-provider"
import { CategoryForm } from "./category-form"

export function UpdateCategoryDialog() {
  const {
    updateCategoryEvent,
    cancelUpdateCategoryEvent,
    confirmUpdateCategoryEvent,
  } = useManageCategories()

  async function onSubmit(values: CategoryFormValues) {
    if (!updateCategoryEvent) return
    try {
      await confirmUpdateCategoryEvent({
        ...updateCategoryEvent,
        type: values.type === "1" ? 1 : 2,
        name: values.name,
      })

      toast.success("Category updated successfully")
    } catch (err) {
      toast.error("Failed to update Category")
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
          title="Update Transaction"
          category={updateCategoryEvent}
          onSave={onSubmit}
        ></CategoryForm>
      )}
    </Dialog>
  )
}
