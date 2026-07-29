"use client"

import { TransactionBadge } from "@/components/transaction/transcation-badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCategory } from "@/providers/category-provider"
import { useManageCategoryFilter } from "../providers/manage-category-filter"
import { useMemo, useState } from "react"
import { Category } from "@/types/category"
import { UpdateCategoryDialog } from "./update-category-dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Edit, Trash } from "lucide-react"
import { DeleteCategoryDialog } from "./delete-category-dialog"

export function CategoryList() {
  const { categories } = useCategory()
  const { search } = useManageCategoryFilter()

  const [deleteCategoryEvent, setDeleteCategoryEvent] =
    useState<Category | null>(null)

  const [updateCategoryEvent, setUpdateCategoryEvent] =
    useState<Category | null>(null)

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ),
    [categories, search]
  )

  return (
    <>
      <div className="md: grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filteredCategories.map((category) => (
          <ContextMenu key={category.id}>
            <ContextMenuTrigger asChild>
              <Card>
                <CardContent className="grid grid-cols-[1fr_auto] gap-2">
                  <div className="truncate">{category.name} </div>
                  <TransactionBadge
                    type={category.type === 1 ? "expense" : "income"}
                  >
                    {category.type === 1 ? "Expense" : "Income"}
                  </TransactionBadge>
                </CardContent>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => setUpdateCategoryEvent(category)}>
                <Edit />
                Edit
              </ContextMenuItem>

              <ContextMenuItem
                className="text-destructive"
                onClick={() => setDeleteCategoryEvent(category)}
              >
                <Trash /> Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
      {updateCategoryEvent && (
        <UpdateCategoryDialog
          category={updateCategoryEvent}
          onClose={() => setUpdateCategoryEvent(null)}
        />
      )}
      {deleteCategoryEvent && (
        <DeleteCategoryDialog
          category={deleteCategoryEvent}
          onClose={() => setDeleteCategoryEvent(null)}
        />
      )}
    </>
  )
}
