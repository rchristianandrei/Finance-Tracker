"use client"

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Category } from "@/types/category"
import { CategoryFormValues, categorySchema } from "@/lib/validations/category"
import { ShowSelectedAccount } from "@/components/show-selected-account"

export function CategoryForm({
  title,
  category,
  errorMessage,
  onSave,
}: {
  title: string
  category?: Category
  errorMessage?: string
  onSave: (values: CategoryFormValues) => Promise<void>
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: category?.type ? (category.type === 1 ? "1" : "2") : "1",
      name: category?.name ?? "",
    },
  })

  async function onSubmit(values: CategoryFormValues) {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await onSave(values)
      form.reset()
    } catch (err) {
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-125">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          Enter the category details below and click save.
        </DialogDescription>
      </DialogHeader>
      <ShowSelectedAccount />
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
                    <RadioGroupItem value="2" id="income" />
                    <label htmlFor="income">Income</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="1" id="expense" />
                    <label htmlFor="expense">Expense</label>
                  </div>
                </RadioGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

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
                  autoComplete="off"
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
