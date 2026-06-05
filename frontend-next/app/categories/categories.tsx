"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCategory } from "@/providers/category-provider"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { CategoryTable } from "./category-table"

export function Categories() {
  const { categories } = useCategory()
  const [search, setSearch] = useState("")

  const filteredCategories = useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ),
    [search, categories]
  )

  return (
    <div className="flex h-full flex-col gap-4">
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
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CardContent>
      </Card>
      <div className="flex flex-1 flex-col gap-4 overflow-auto md:flex-row">
        <CategoryTable
          title="Income"
          categories={filteredCategories.filter((c) => c.type === 2)}
        />
        <CategoryTable
          title="Expense"
          categories={filteredCategories.filter((c) => c.type === 1)}
        />
      </div>
    </div>
  )
}
