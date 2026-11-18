"use client"

import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Controller } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useCategory } from "@/providers/category-provider"
import { useSaveTransaction } from "./save-transation-provider"
import { AccountController } from "./components/account-controller"
import { DescriptionController } from "./components/description-controller"
import { AmountAndDateController } from "./components/amount-and-date-controller"
import { CategoryController } from "./components/category-controller"
import { useEffect } from "react"

export function ExpenseTransactionForm() {
  const { categories } = useCategory()
  const {
    form,
    currentType,
    selectedFromAccount,
    selectedCategory,
    currentTransactionDate,
  } = useSaveTransaction()

  useEffect(() => {
    if (selectedCategory?.type === 1) return
    form.setValue("categoryId", 0)
  }, [currentType])

  return (
    <>
      <AccountController name="fromAccountId" account={selectedFromAccount} />
      <CategoryController categories={categories.filter((c) => c.type === 1)} />
      <DescriptionController />
      <AmountAndDateController />
      <fieldset>
        <Controller
          name="dashboardDate"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel asChild>
                  <span>
                    Due Date{" "}
                    <span className="text-muted-foreground">(Optional)</span>
                  </span>
                </FieldLabel>

                <div className="space-y-3">
                  <fieldset className="grid grid-cols-[1fr_auto] gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {field.value
                            ? format(field.value, "MMM d")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto gap-0 p-4">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date) return

                            date.setHours(currentTransactionDate.getHours())
                            date.setMinutes(currentTransactionDate.getMinutes())

                            field.onChange(date)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => form.resetField("dashboardDate")}
                    >
                      Clear
                    </Button>
                  </fieldset>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </div>
              </Field>
            )
          }}
        />
      </fieldset>
    </>
  )
}
