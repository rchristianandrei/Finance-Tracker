import { Controller } from "react-hook-form"
import { useSaveTransaction } from "../save-transation-provider"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { format } from "date-fns/format"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

export function AmountAndDateController() {
  const { form } = useSaveTransaction()
  return (
    <fieldset className="grid grid-cols-2 gap-4">
      <Controller
        name="amount"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Amount</FieldLabel>

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
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="date"
        control={form.control}
        render={({ field, fieldState }) => {
          const timeValue = field.value ? format(field.value, "HH:mm") : ""

          return (
            <Field>
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

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )
        }}
      />
    </fieldset>
  )
}
