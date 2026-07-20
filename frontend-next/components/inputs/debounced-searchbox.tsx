"use client"

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

export function DebouncedSearchBox({
  placeholder,
  value,
  delay,
  onValueChange: onValueChange,
}: {
  placeholder?: string
  value?: string
  delay?: number
  onValueChange?: (value: string) => void
}) {
  const [search, setSearch] = useState(value ?? "")

  const changeSearch = useDebouncedCallback((value: string) => {
    onValueChange?.(value)
  }, delay ?? 500)

  useEffect(() => {
    return () => {
      changeSearch.cancel()
    }
  }, [])

  return (
    <Input
      placeholder={placeholder ?? "Search..."}
      value={search}
      className="w-full md:w-75"
      onChange={(e) => {
        setSearch(e.target.value)
        changeSearch(e.target.value)
      }}
    />
  )
}
