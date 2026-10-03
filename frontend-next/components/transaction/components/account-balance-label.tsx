import { FieldLabel } from "@/components/ui/field"
import { formatMoney } from "@/lib/format-money"
import { Account } from "@/types/account"

export function AccountBalanceLabel({ account }: { account: Account }) {
  return (
    <FieldLabel className="text-muted-foreground">
      Balance: {formatMoney(account.balance ?? 0.0)}
    </FieldLabel>
  )
}
