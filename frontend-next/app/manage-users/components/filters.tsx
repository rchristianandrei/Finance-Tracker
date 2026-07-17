"use client"

import { DebouncedSearchBox } from "@/components/inputs/debounced-searchbox"
import { Card, CardContent } from "@/components/ui/card"

export function Filters() {
  const onSearchChange = (value: string) => {
    console.log("Search Value:", value)
  }

  return (
    <Card>
      <CardContent>
        <DebouncedSearchBox
          placeholder="Search Users..."
          onValueChange={onSearchChange}
        />
      </CardContent>
    </Card>
  )
}
