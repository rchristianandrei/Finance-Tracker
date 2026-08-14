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
import { useTransactionFilter } from "../providers/transaction-filter-provider"
import { MultiSelectInput } from "@/components/inputs/multi-select-input"
import { useAccount } from "@/providers/account-provider"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function TransactionFilter() {
  const {
    search: searchParam,
    type,
    dateRange,
    selectedAccounts,
    selectedCategories,
    filteredCategories,
    changeSearch,
    changeType,
    changeSelectedAccount,
    changeSelectedCategory,
    changeDate,
    clearFilters,
  } = useTransactionFilter()

  const { accounts } = useAccount()

  const [search, setSearch] = useState(() => searchParam ?? "")

  return (
    <Card>
      <CardContent className="flex flex-wrap gap-3">
        <div className="flex w-auto items-center gap-3 overflow-auto">
          {/* Search */}
          <Input
            placeholder={"Search transactions..."}
            value={search}
            className="min-w-50"
            onChange={(e) => {
              setSearch(e.target.value)
              changeSearch(e.target.value)
            }}
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

          {/* Account */}
          <MultiSelectInput
            displayText="Accounts"
            choices={accounts.map((a) => ({
              key: a.id.toString(),
              value: a.name,
            }))}
            selected={selectedAccounts}
            onSelectedValueChange={(values) => changeSelectedAccount(values)}
          />

          {/* Category */}
          {type !== "transfer" && (
            <MultiSelectInput
              displayText="Categories"
              choices={filteredCategories.map((c) => ({
                key: c.id.toString(),
                value: c.name,
              }))}
              selected={selectedCategories}
              onSelectedValueChange={(values) => changeSelectedCategory(values)}
            />
          )}

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

        <Button
          variant="outline"
          onClick={() => {
            clearFilters()
            setSearch("")
          }}
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </CardContent>
    </Card>
  )
}
