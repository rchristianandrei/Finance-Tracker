"use client"

import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useDebouncedCallback } from "use-debounce"

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
import { useManageTransactions } from "./manage-transactions-provider"
import { useCategory } from "@/providers/CategoryProvider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMemo } from "react"

export function TransactionFilter() {
  const { categories } = useCategory()
  const {
    searchParams,
    search,
    dateRange,
    type,
    selectedCategories,
    setSearch,
    navigate,
    clearFilters,
  } = useManageTransactions()

  const filteredCategories = useMemo(() => {
    if (!type) return categories

    return categories.filter(
      (c) => (c.type === 2 ? "income" : "expense") === type
    )
  }, [categories, type])

  const allSelected = selectedCategories.length === 0

  const handleSearch = useDebouncedCallback((value: string) => {
    navigate({
      search: value || undefined,
    })
  }, 500)

  const categoryChange = (categoryName: string, checked: boolean) => {
    let next: string[]

    if (categoryName === "all") {
      next = []
    } else {
      next = checked
        ? [...selectedCategories, categoryName]
        : selectedCategories.filter((c) => c !== categoryName)
    }

    if (next.length === filteredCategories.length) {
      next = []
    }

    navigate({
      category: next.length > 0 ? next.join(",") : undefined,
    })
  }

  const onDateChange = (range: DateRange | undefined) => {
    navigate({
      from: range?.from
        ? format(range.from, "yyyy-MM-dd'T'00:00:00.000")
        : undefined,

      to: range?.to ? format(range.to, "yyyy-MM-dd'T'00:00:00.000") : undefined,
    })
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
              category: undefined,
              page: undefined,
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

        {/* Category — replace your existing <Select> block */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-55 justify-start truncate font-normal"
            >
              {allSelected
                ? "All Categories"
                : selectedCategories.length === 1
                  ? filteredCategories.find(
                      (c) => c.id === Number(selectedCategories[0])
                    )?.name
                  : `${selectedCategories.length} categories`}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-55 p-2" align="start">
            <div className="flex flex-col gap-1">
              {/* All option */}
              <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => categoryChange("all", true)}
                  className="accent-primary"
                />
                All Categories
              </label>

              <div className="my-1 border-t" />

              <TooltipProvider>
                {/* Individual categories */}
                {filteredCategories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(
                        category.id.toString()
                      )}
                      onChange={(e) =>
                        categoryChange(category.id.toString(), e.target.checked)
                      }
                      className="accent-primary"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate">{category.name}</span>
                      </TooltipTrigger>
                      <TooltipContent className="truncate">
                        {category.name}
                      </TooltipContent>
                    </Tooltip>
                  </label>
                ))}
              </TooltipProvider>
            </div>
          </PopoverContent>
        </Popover>

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
