"use client"

import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useDebouncedCallback } from "use-debounce"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar"

import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { useCallback, useEffect, useMemo, useState } from "react"

type Category = {
  id: string
  name: string
}

type Props = {
  categories: Category[]
}

export function TransactionFilter({ categories }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") ?? "")

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "")
  }, [searchParams])

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      params.delete("page")

      return params.toString()
    },
    [searchParams]
  )

  const navigate = (updates: Record<string, string | undefined>) => {
    router.replace(`${pathname}?${createQueryString(updates)}`)
  }

  const handleSearch = useDebouncedCallback((value: string) => {
    navigate({
      search: value || undefined,
    })
  }, 500)

  const dateRange: DateRange | undefined = useMemo(() => {
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!from && !to) return undefined

    return {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    }
  }, [searchParams])

  const onDateChange = (range: DateRange | undefined) => {
    navigate({
      from: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,

      to: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
    })
  }

  const clearFilters = () => {
    router.replace(pathname)
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <Input
          placeholder="Search transactions..."
          value={search}
          className="w-full md:w-75"
          onChange={(e) => {
            setSearch(e.target.value)
            handleSearch(e.target.value)
          }}
        />

        {/* Type */}

        <Select
          value={searchParams.get("type") ?? "all"}
          onValueChange={(value) =>
            navigate({
              type: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>

            <SelectItem value="income">Income</SelectItem>

            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        {/* Category */}

        <Select
          value={searchParams.get("category") ?? "all"}
          onValueChange={(value) =>
            navigate({
              category: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-55">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>

            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range */}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-70 justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />

              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                    {format(dateRange.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "MMM dd, yyyy")
                )
              ) : (
                "Pick a date range"
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Clear */}

        <Button variant="outline" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </CardContent>
    </Card>
  )
}
