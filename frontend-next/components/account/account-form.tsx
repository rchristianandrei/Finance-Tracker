"use client"

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Account } from "@/types/account"
import { AccountFormValues, accountSchema } from "@/lib/validations/account"

export function AccountForm({
  title,
  account,
  errorMessage,
  onSave,
}: {
  title: string
  account?: Account
  errorMessage?: string
  onSave: (values: AccountFormValues) => Promise<void>
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name ?? "",
      initialBalance: account?.balance,
    },
  })

  async function onSubmit(values: AccountFormValues) {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await onSave(values)
      form.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DialogContent
      className="sm:max-w-125"
      onCloseAutoFocus={(e) => {
        e.preventDefault()
      }}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          Enter the account details below and click save.
        </DialogDescription>
      </DialogHeader>
      <fieldset disabled={isSubmitting}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>

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
            name="initialBalance"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Initial Balance</FieldLabel>

                <Input
                  id={field.name}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
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
            {isSubmitting ? <Spinner className="ml-2" /> : "Save"}
          </Button>
        </form>
      </fieldset>
    </DialogContent>
  )
}
