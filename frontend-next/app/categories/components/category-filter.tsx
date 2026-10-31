"use client"

import { CreateCategorySheet } from "@/components/category/create-category-sheet"
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
      <CardContent className="flex items-center justify-between gap-3">
        <Input
          placeholder="Search categories..."
          value={search}
          className="max-w-75 flex-1"
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
          <p className="hidden md:block">Add Category</p>
        </Button>
        {isCreateCategoryDialogOpen && (
          <CreateCategorySheet
            onClose={() => setIsCreateCategoryDialogOpen(false)}
          />
        )}
      </CardContent>
    </Card>
  )
}
