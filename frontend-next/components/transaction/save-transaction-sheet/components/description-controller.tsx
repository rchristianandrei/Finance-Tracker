import { Controller } from "react-hook-form"
import { useSaveTransaction } from "../save-transation-provider"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function DescriptionController() {
  const { form } = useSaveTransaction()
  return (
    <Controller
      name="description"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor={field.name}>Description</FieldLabel>

          <Input {...field} id={field.name} />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
