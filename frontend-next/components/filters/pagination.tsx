"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function Pagination({ totalItems }: { totalItems?: number }) {
  const prevPage = () => {}

  const nextPage = () => {}

  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="outline" onClick={prevPage}>
        <ChevronDown className="rotate-90" />
      </Button>

      <div className="text-sm text-muted-foreground">
        0 - 0 of {totalItems ?? 0}
      </div>

      <Button variant="outline" onClick={nextPage}>
        <ChevronDown className="-rotate-90" />
      </Button>
    </div>
  )
}
