"use client"

import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Transaction } from "@/types/transaction"
import { CreateCategorySheet } from "@/components/category/create-category-sheet"
import { ResponsiveSheetContent } from "@/components/ResponsiveSheetContent"
import { ExpenseTransactionForm } from "./expense-transaction-form"
import {
  SaveTransactionProvider,
  useSaveTransaction,
} from "./save-transation-provider"
import { TransactionFormValues } from "@/lib/validations/transaction"
import { IncomeTransactionForm } from "./income-transaction-form"
import { Controller } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { TransferTransactionFields } from "./transfer-transaction-fields"
import { useState } from "react"
import axios from "axios"

export function SaveTransactionSheet({
  hideTrigger,
  initialOpen,
  title,
  initialTransaction,
  onClose,
}: {
  hideTrigger?: boolean
  initialOpen?: boolean
  title: string
  initialTransaction?: Transaction
  onClose?: () => void
}) {
  return (
    <SaveTransactionProvider
      initialTransaction={initialTransaction}
      initialOpen={initialOpen}
    >
      <SaveTransaction
        hideTrigger={hideTrigger}
        title={title}
        onClose={onClose}
      />
    </SaveTransactionProvider>
  )
}

export function SaveTransaction({
  hideTrigger,
  title,
  onClose,
}: {
  hideTrigger?: boolean
  title: string
  onClose?: () => void
}) {
  const {
    form,
    isSubmitting,
    isCreateCategorySheetOpen,
    isTransactionSheetOpen,
    currentType,
    submitTransaction,
    closeTransactionSheet,
    openTransactionSheet,
    closeCategorySheet,
  } = useSaveTransaction()

  const [errorMessage, setErrorMessage] = useState("")

  async function onSuccess(values: TransactionFormValues) {
    setErrorMessage("")
    try {
      await submitTransaction(values)
      closeTransactionSheet()
      onClose?.()
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setErrorMessage(e.response?.data)
      }
    }
  }

  return (
    <>
      <Sheet
        open={isTransactionSheetOpen}
        onOpenChange={(value) => {
          if (value) {
            openTransactionSheet()
            return
          }
          closeTransactionSheet()
          onClose?.()
        }}
      >
        {!hideTrigger && (
          <SheetTrigger asChild>
            <Button variant="default">
              <Plus />
              <span className="hidden md:inline">Add Transaction</span>
            </Button>
          </SheetTrigger>
        )}

        <ResponsiveSheetContent>
          <form onSubmit={form.handleSubmit(onSuccess)}>
            <SheetHeader className="shrink-0 gap-1 text-left">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription className="sr-only">
                Create or edit a transaction.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-4">
              <fieldset className="space-y-4 px-4" disabled={isSubmitting}>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const options = [
                      {
                        label: "Income",
                        value: "income",
                        className: "bg-green-600 text-white",
                      },
                      {
                        label: "Expense",
                        value: "expense",
                        className: "bg-red-500 text-white",
                      },
                      {
                        label: "Transfer",
                        value: "transfer",
                        className: "text-black",
                      },
                    ]
                    return (
                      <Field>
                        <FieldLabel>Type</FieldLabel>

                        <div className="grid grid-cols-3 gap-2 rounded-full bg-muted p-1">
                          {options.map((option) => (
                            <Button
                              key={option.value}
                              type="button"
                              size="sm"
                              variant={
                                field.value === option.value
                                  ? "default"
                                  : "ghost"
                              }
                              className={cn(
                                "rounded-full text-muted-foreground",
                                currentType === option.value
                                  ? option.className
                                  : ""
                              )}
                              onClick={() => {
                                if (field.value !== option.value) {
                                  field.onChange(option.value)
                                  form.clearErrors()
                                }
                              }}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )
                  }}
                />

                {currentType === "income" && <IncomeTransactionForm />}
                {currentType === "expense" && <ExpenseTransactionForm />}
                {currentType === "transfer" && <TransferTransactionFields />}
              </fieldset>

              {errorMessage && (
                <FieldError className="px-4">{errorMessage}</FieldError>
              )}
            </div>
            <SheetFooter>
              <Button type="submit" className="w-full">
                {isSubmitting ? <Spinner className="ml-2" /> : "Save"}
              </Button>
            </SheetFooter>
          </form>
        </ResponsiveSheetContent>
      </Sheet>

      {isCreateCategorySheetOpen && (
        <CreateCategorySheet
          onClose={() => {
            closeCategorySheet()
          }}
        />
      )}
    </>
  )
}
