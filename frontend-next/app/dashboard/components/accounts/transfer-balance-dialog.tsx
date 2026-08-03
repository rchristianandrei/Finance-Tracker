"use client"

import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Account } from "@/types/account"
import { useAccount } from "@/providers/account-provider"
import { Controller, useForm } from "react-hook-form"
import {
  TransferBalanceFormValues,
  transferBalanceSchema,
} from "@/lib/validations/transfer-balance"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TransferBalanceDialog({
  account,
  onClose,
}: {
  account: Account
  onClose: () => void
}) {
  const { accounts, transferBalance } = useAccount()
  const [isOpen, setIsOpen] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TransferBalanceFormValues>({
    resolver: zodResolver(transferBalanceSchema),
    defaultValues: {
      fromAccountId: account.id,
      toAccountId: undefined,
      amount: undefined,
    },
  })

  async function onSubmit(values: TransferBalanceFormValues) {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await transferBalance({
        fromAccountId: values.fromAccountId,
        toAccountId: values.toAccountId,
        amount: values.amount,
      })

      toast.success("Transfer completed successfully")
      onClose()
    } catch (err) {
      setErrorMessage("Failed to transfer balance")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog
        open={isOpen && account != null}
        onOpenChange={(value) => {
          setIsOpen(value)
          onClose()
        }}
      >
        <DialogContent
          className="sm:max-w-125"
          onCloseAutoFocus={(e) => {
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle>Transfer Account Balance</DialogTitle>
            <DialogDescription>
              Enter the details below and click save.
            </DialogDescription>
          </DialogHeader>
          <fieldset disabled={isSubmitting}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="fromAccountId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>From Account</FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      disabled
                      value={account.name}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
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
                          value={field.value?.toString() ?? ""}
                          onValueChange={(value) => {
                            field.onChange(Number(value))
                          }}
                        >
                          <SelectTrigger className="w-full min-w-0">
                            <SelectValue placeholder="Select Account" />
                          </SelectTrigger>

                          <SelectContent>
                            {accounts.map((a) => {
                              if (a.id === account.id) return null
                              return (
                                <SelectItem key={a.id} value={a.id.toString()}>
                                  {a.name}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )
                }}
              />

              <Controller
                name="amount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Amount to Transfer
                    </FieldLabel>

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

              {errorMessage && (
                <FieldError className="text-center">{errorMessage}</FieldError>
              )}

              <Button type="submit" className="w-full">
                {isSubmitting ? <Spinner className="ml-2" /> : "Transfer"}
              </Button>
            </form>
          </fieldset>
        </DialogContent>
      </Dialog>
    </>
  )
}
