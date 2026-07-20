"use client"

import { DebouncedSearchBox } from "@/components/inputs/debounced-searchbox"
import { Card, CardContent } from "@/components/ui/card"
import { useUserFilter } from "../providers/user-filter-provider"

export function Filters() {
  const { search, changeSearch } = useUserFilter()

  return (
    <Card>
      <CardContent>
        <DebouncedSearchBox
          value={search}
          placeholder="Search Users..."
          onValueChange={changeSearch}
        />
      </CardContent>
    </Card>
  )
}
