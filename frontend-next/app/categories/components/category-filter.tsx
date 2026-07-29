"use client"

import { CreateCategoryDialog } from "@/components/category/create-category-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useManageCategoryFilter } from "../providers/manage-category-filter"

export function CategoryFilter() {
  const { search, setSearch } = useManageCategoryFilter()
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] =
    useState(false)
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="Search categories..."
          value={search}
          className="w-full md:w-75"
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
        <Button
          variant="outline"
          type="button"
          onClick={() => setIsCreateCategoryDialogOpen(true)}
        >
          <Plus />
          Add Category
        </Button>
        {isCreateCategoryDialogOpen && (
          <CreateCategoryDialog
            onClose={() => setIsCreateCategoryDialogOpen(false)}
          />
        )}
      </CardContent>
    </Card>
  )
}
