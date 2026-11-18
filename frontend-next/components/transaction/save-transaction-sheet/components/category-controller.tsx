import { Controller } from "react-hook-form"
import { useSaveTransaction } from "../save-transation-provider"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Category } from "@/types/category"

export function CategoryController({ categories }: { categories: Category[] }) {
  const { form, openCategorySheet } = useSaveTransaction()
  return (
    <Controller
      name="categoryId"
      control={form.control}
      render={({ field, fieldState }) => {
        return (
          <Field>
            <FieldLabel>Category</FieldLabel>

            <div className="grid grid-cols-[1fr_auto] gap-1">
              <Select
                value={field.value ? field.value.toString() : ""}
                onValueChange={(value) => {
                  field.onChange(Number(value))
                }}
              >
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                type="button"
                onClick={openCategorySheet}
              >
                <Plus />
              </Button>
            </div>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
