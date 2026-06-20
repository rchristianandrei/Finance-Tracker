"use client"

import { format } from "date-fns"

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMemo, useState } from "react"
import { useTransactionFilter } from "../providers/transaction-filter-provider"

export function TransactionFilter() {
  const {
    search: querySearch,
    type,
    dateRange,
    selectedCategories,
    filteredCategories,
    changeSearch,
    changeType,
    changeSelectedCategory,
    changeDate,
    clearFilters,
  } = useTransactionFilter()

  const [search, setSearch] = useState(querySearch ?? "")

  const allSelected = useMemo(
    () => selectedCategories.length === 0,
    [selectedCategories]
  )

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
            changeSearch(e.target.value)
          }}
        />

        {/* Type */}

        <Select value={type ?? "all"} onValueChange={changeType}>
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
                  onChange={() => changeSelectedCategory("all", true)}
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
                        changeSelectedCategory(
                          category.id.toString(),
                          e.target.checked
                        )
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
            <div className="border-b p-2 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeDate(undefined)}
                disabled={!dateRange?.from}
              >
                <X />
                Clear dates
              </Button>
            </div>

            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={changeDate}
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
