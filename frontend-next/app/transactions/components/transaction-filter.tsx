"use client"

import { format } from "date-fns"

import { Button } from "@/components/ui/button"

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
import { useMemo } from "react"
import { useTransactionFilter } from "../providers/transaction-filter-provider"
import { DebouncedSearchBox } from "@/components/inputs/debounced-searchbox"

export function TransactionFilter() {
  const {
    search,
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

  const allSelected = useMemo(
    () => selectedCategories.length === 0,
    [selectedCategories]
  )

  return (
    <Card>
      <CardContent className="flex flex-wrap gap-3">
        <div className="flex w-auto items-center gap-3 overflow-auto">
          {/* Search */}
          <DebouncedSearchBox
            value={search}
            placeholder="Search transactions..."
            onValueChange={changeSearch}
            className="min-w-50"
          />

          {/* Type */}

          <Select value={type ?? "all"} onValueChange={changeType}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>

              <SelectItem value="income">Income</SelectItem>

              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>

          {/* Category */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-auto justify-start truncate font-normal"
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

            <PopoverContent
              align="start"
              className="w-55 p-2"
              style={{
                maxHeight: "var(--radix-popover-content-available-height)",
              }}
            >
              {/* Fixed */}
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

              {/* Scrollable */}
              <div className="overflow-y-auto">
                <div className="flex flex-col gap-1">
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

                      <span className="truncate">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-auto justify-start text-left font-normal",
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

            <PopoverContent
              align="start"
              className="flex w-auto flex-col overflow-hidden p-0"
              style={{
                maxHeight: "var(--radix-popover-content-available-height)",
              }}
            >
              <div className="shrink-0 border-b p-2 text-center">
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

              <div className="min-h-0 flex-1 overflow-y-auto">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={changeDate}
                  numberOfMonths={2}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear */}

        <Button variant="outline" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </CardContent>
    </Card>
  )
}
