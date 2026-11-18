"use client"

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
import { formatMoney } from "@/lib/format-money"
import { Account } from "@/types/account"
import { useAccount } from "@/providers/account-provider"

export function AccountController({
  name,
  account,
}: {
  name: "fromAccountId" | "toAccountId"
  account: Account | undefined
}) {
  const { form } = useSaveTransaction()
  const { accounts } = useAccount()

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        return (
          <Field>
            <FieldLabel>
              {name === "fromAccountId" ? "From Account" : "To Account"}
            </FieldLabel>

            <div className="grid grid-cols-[1fr_auto] gap-1">
              <Select
                value={field.value?.toString() ?? ""}
                onValueChange={(value) => {
                  field.onChange(value ? Number(value) : undefined)
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
            </div>

            <FieldLabel className="text-muted-foreground">
              Balance: {formatMoney(account?.balance ?? 0.0)}
            </FieldLabel>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
