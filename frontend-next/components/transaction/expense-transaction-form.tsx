"use client"

import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { useCategory } from "@/providers/category-provider"
import { Transaction } from "@/types/transaction"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, Plus } from "lucide-react"
import { useAccount } from "@/providers/account-provider"
import {
  ExpenseTransactionFormValues,
  expenseTransactionSchema,
} from "@/lib/validations/transactions"
import { useAddTransaction } from "@/providers/add-transaction-provider"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { isSameISODate } from "@/lib/compare-date"
import { Switch } from "@/components/ui/switch"

export function ExpenseTransactionForm({
  transaction,
  onAddCategoryClick,
  onSuccess,
}: {
  transaction?: Transaction
  onAddCategoryClick?: () => void
  onSuccess?: () => void
}) {
  const { accounts } = useAccount()
  const { categories } = useCategory()
  const { addExpenseTransaction, updateExpenseTransaction } =
    useAddTransaction()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ExpenseTransactionFormValues>({
    resolver: zodResolver(expenseTransactionSchema),
    defaultValues: {
      fromAccountId:
        transaction?.fromAccount?.id ?? transaction?.toAccount?.id ?? 0,
      categoryId: transaction?.category?.id ?? 0,
      description: transaction?.description ?? "",
      amount: transaction?.amount ?? undefined,
      date: transaction?.date ?? new Date(),
      dashboardDate: transaction?.dashboardDate,
      useSameDateAsDashboardDate: isSameISODate(
        transaction?.dashboardDate ?? new Date(),
        transaction?.date ?? new Date()
      ),
    },
  })

  const useSameDateAsDashboardDate = form.watch("useSameDateAsDashboardDate")

  async function onSubmit(values: ExpenseTransactionFormValues) {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      if (values.useSameDateAsDashboardDate) {
        values.dashboardDate = values.date
      }
      if (transaction) {
        await updateExpenseTransaction({ ...values, id: transaction.id })
      } else {
        await addExpenseTransaction(values)
      }
      onSuccess?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <fieldset disabled={isSubmitting}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <Controller
            name="fromAccountId"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>From Account</FieldLabel>

                  <div className="grid grid-cols-[1fr_auto] gap-1">
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                      }}
                    >
                      <SelectTrigger className="w-full min-w-0">
                        <SelectValue placeholder="Select Account" />
                      </SelectTrigger>

                      <SelectContent>
                        {accounts.map((a) => (
                          <SelectItem key={a.id} value={a.id.toString()}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <Button variant="outline" type="button">
                          <Plus />
                        </Button> */}
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )
            }}
          />

          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => {
              const filtered = categories.filter((c) => c.type === 1)

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category</FieldLabel>

                  <div className="grid grid-cols-[1fr_auto] gap-1">
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                      }}
                    >
                      <SelectTrigger className="w-full min-w-0">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>

                      <SelectContent>
                        {filtered.map((m) => (
                          <SelectItem key={m.id} value={m.id.toString()}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={onAddCategoryClick}
                    >
                      <Plus />
                    </Button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )
            }}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <fieldset className="grid grid-cols-2 gap-4">
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Amount</FieldLabel>

                  <Input
                    id={field.name}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => {
                const timeValue = field.value
                  ? format(field.value, "HH:mm")
                  : ""

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Date & Time</FieldLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {field.value
                            ? format(field.value, "MMM d, h:mm a")
                            : "Select date & time"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto gap-0 p-4">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date) return

                            const current = field.value ?? new Date()

                            date.setHours(current.getHours())
                            date.setMinutes(current.getMinutes())

                            field.onChange(date)

                            if (form.getValues("useSameDateAsDashboardDate")) {
                              form.setValue("dashboardDate", date)
                            }
                          }}
                        />

                        <input
                          type="time"
                          value={timeValue}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number)

                            const date = field.value
                              ? new Date(field.value)
                              : new Date()

                            date.setHours(hours)
                            date.setMinutes(minutes)

                            field.onChange(date)
                          }}
                          className="w-full rounded border px-2 py-1"
                        />
                      </PopoverContent>
                    </Popover>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />
          </fieldset>

          <fieldset>
            <Controller
              name="dashboardDate"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Collapsible>
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel asChild>
                        <CollapsibleTrigger className="group">
                          <ChevronDown className="size-4 -rotate-90 transition-transform duration-200 group-data-[state=open]:rotate-0" />
                          <span>Dashboard Date</span>
                        </CollapsibleTrigger>
                      </FieldLabel>

                      <CollapsibleContent asChild>
                        <div className="space-y-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start"
                                disabled={useSameDateAsDashboardDate}
                              >
                                {field.value
                                  ? format(field.value, "MMM d")
                                  : "Select date"}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto gap-0 p-4">
                              <Calendar
                                disabled={useSameDateAsDashboardDate}
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (!date || useSameDateAsDashboardDate)
                                    return

                                  const current = field.value ?? new Date()

                                  date.setHours(current.getHours())
                                  date.setMinutes(current.getMinutes())

                                  field.onChange(date)
                                }}
                              />
                            </PopoverContent>
                          </Popover>

                          <Controller
                            name="useSameDateAsDashboardDate"
                            control={form.control}
                            render={({ field: sameDateField }) => (
                              <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <div className="text-sm font-medium">
                                    Use transaction date
                                  </div>

                                  <p className="text-xs text-muted-foreground">
                                    Keep the dashboard date the same as the
                                    transaction date.
                                  </p>
                                </div>

                                <Switch
                                  checked={sameDateField.value}
                                  onCheckedChange={(checked) => {
                                    sameDateField.onChange(checked)

                                    if (checked) {
                                      field.onChange(form.getValues("date"))
                                    }
                                  }}
                                />
                              </div>
                            )}
                          />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </div>
                      </CollapsibleContent>
                    </Field>
                  </Collapsible>
                )
              }}
            />
          </fieldset>

          <Button type="submit" className="w-full">
            {isSubmitting ? <Spinner className="ml-2" /> : "Save"}
          </Button>
        </form>
      </fieldset>
    </>
  )
}
