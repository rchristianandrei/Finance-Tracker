"use client"

import { format } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { Calendar } from "@/components/ui/calendar"

import { Plus } from "lucide-react"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { transactionSchema } from "@/lib/validations/transaction"
import { TransactionFormValues } from "@/lib/validations/transaction"
import { Field, FieldError, FieldLabel } from "./ui/field"
import { useEffect, useState } from "react"
import { TransactionType } from "@/types/category"
import { transactionApi } from "@/api/transactions"
import { useAccount } from "@/providers/account-provider"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"
import { useCategory } from "@/providers/category-provider"

export function TransactionFormDialog() {
  const { selectedAccount } = useAccount()
  const { categories } = useCategory()

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "1",
      category: "",
      description: "",
      amount: undefined,
      date: undefined,
    },
  })

  const selectedType = form.watch("type")

  useEffect(() => {
    form.resetField("category")
  }, [selectedType])

  async function onSubmit(values: TransactionFormValues) {
    if (isSubmitting) return
    setIsSubmitting(true)
    if (!selectedAccount) return
    try {
      await transactionApi.createTransaction(selectedAccount.id, {
        type: Number(values.type) as TransactionType,
        category: values.category,
        description: values.description,
        amount: values.amount!,
        date: new Date(values.date),
      })

      toast.success("Transaction created successfully")
      form.reset()
    } catch (err) {
      console.error(err)
      toast.error("Failed to create transaction")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus></Plus>{" "}
          <span className="hidden md:inline">Add Transaction</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>
            Enter the transaction details below and click save.
          </DialogDescription>
        </DialogHeader>

        <fieldset disabled={isSubmitting}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Type</FieldLabel>

                  <RadioGroup
                    value={field.value.toString()}
                    onValueChange={field.onChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="1" id="expense" />
                      <label htmlFor="expense">Expense</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="2" id="income" />
                      <label htmlFor="income">Income</label>
                    </div>
                  </RadioGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => {
                const value = field.value ?? ""

                const filtered = categories
                  .filter(
                    (c) =>
                      c.type.toString() === selectedType &&
                      c.name.toLowerCase().includes(value.toLowerCase())
                  )
                  .map((c) => c.name)

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>

                    <div className="relative">
                      <Input
                        {...field}
                        value={value}
                        autoComplete="off"
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          setCategoryOpen(true)
                        }}
                        onFocus={() => setCategoryOpen(true)}
                        onBlur={() => {
                          // small delay so clicks still work
                          setTimeout(() => setCategoryOpen(false), 100)
                        }}
                        placeholder="Type or select a category"
                      />

                      {categoryOpen && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                          <Command shouldFilter={false}>
                            <CommandList>
                              <CommandEmpty>No results</CommandEmpty>

                              <CommandGroup>
                                {filtered.map((category) => (
                                  <CommandItem
                                    key={category}
                                    value={category}
                                    onMouseDown={(e) => {
                                      // prevents blur before click
                                      e.preventDefault()
                                    }}
                                    onSelect={() => {
                                      field.onChange(category)
                                      setCategoryOpen(false)
                                    }}
                                  >
                                    {category}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </div>
                      )}
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
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Date</FieldLabel>

                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date)
                          setDateOpen(false) // 👈 close on select
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full">
              {isSubmitting ? <Spinner className="ml-2" /> : "Save"}
            </Button>
          </form>
        </fieldset>
      </DialogContent>
    </Dialog>
  )
}
