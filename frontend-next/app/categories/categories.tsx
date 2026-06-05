"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCategory } from "@/providers/category-provider"
import { BanknoteArrowDown, BanknoteArrowUp, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { CategoryTable } from "./components/category-table"
import { CreateCategoryDialog } from "./components/create-category-dialog"

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
          <CreateCategoryDialog />
        </CardContent>
      </Card>
      <div className="flex flex-1 flex-col gap-4 overflow-auto md:flex-row">
        <CategoryTable
          icon={<BanknoteArrowUp />}
          title="Income"
          categories={filteredCategories.filter((c) => c.type === 2)}
        />
        <CategoryTable
          icon={<BanknoteArrowDown />}
          title="Expense"
          categories={filteredCategories.filter((c) => c.type === 1)}
        />
      </div>
    </div>
  )
}
