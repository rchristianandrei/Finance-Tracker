"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function Pagination({
  display,
  disableNext,
  disablePrev,
  onNext,
  onPrev,
}: {
  display?: string
  currentPage?: number
  disableNext?: boolean
  disablePrev?: boolean
  onNext?: () => void
  onPrev?: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="outline" onClick={onPrev} disabled={disablePrev}>
        <ChevronDown className="rotate-90" />
      </Button>

      <div className="text-sm text-muted-foreground">{display}</div>

      <Button variant="outline" onClick={onNext} disabled={disableNext}>
        <ChevronDown className="-rotate-90" />
      </Button>
    </div>
  )
}
