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
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Transaction } from "@/types/transaction"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAccount } from "@/providers/account-provider"
import {
  TransferTransactionFormValues,
  transferTransactionSchema,
} from "@/lib/validations/transactions"

export function TransferTransactionForm({
  transaction,
}: {
  transaction?: Transaction
}) {
  const { accounts } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TransferTransactionFormValues>({
    resolver: zodResolver(transferTransactionSchema),
    defaultValues: {
      fromAccountId: transaction?.toAccount.id ?? 0,
      toAccountId: transaction?.toAccount.id ?? 0,
      description: transaction?.description ?? "",
      amount: transaction?.amount ?? undefined,
      date: transaction?.date ?? new Date(),
    },
  })

  const selectedFromAccountId = form.watch("fromAccountId")

  useEffect(() => {
    form.resetField("toAccountId")
  }, [selectedFromAccountId])

  async function onSubmit(values: TransferTransactionFormValues) {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
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
            name="toAccountId"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>To Account</FieldLabel>

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
                        {accounts.map((a) => {
                          if (a.id === form.getValues("fromAccountId"))
                            return null
                          return (
                            <SelectItem key={a.id} value={a.id.toString()}>
                              {a.name}
                            </SelectItem>
                          )
                        })}
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

          <Button type="submit" className="w-full">
            {isSubmitting ? <Spinner className="ml-2" /> : "Save"}
          </Button>
        </form>
      </fieldset>
    </>
  )
}
