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
import { Checkbox } from "@/components/ui/checkbox"
import { useAccount } from "@/providers/account-provider"

export function AccountForm({
  title,
  account,
  onSave,
}: {
  title: string
  account?: Account
  onSave: (values: AccountFormValues) => Promise<void>
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { defaultAccount } = useAccount()

  const isInitiallyDefault = account?.id === defaultAccount?.id

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name ?? "",
      isDefault: isInitiallyDefault,
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
    <DialogContent className="sm:max-w-125">
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
            name="isDefault"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isDefault"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isInitiallyDefault}
                  />

                  <FieldLabel htmlFor="isDefault">
                    Set as default account
                  </FieldLabel>
                </div>

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
  )
}
