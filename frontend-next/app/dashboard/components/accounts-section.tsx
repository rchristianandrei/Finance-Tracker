import { CreateAccountDialog } from "@/components/account/create-account-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMoney } from "@/lib/format-money"
import { cn } from "@/lib/utils"
import { useAccount } from "@/providers/account-provider"

export function AccountsSection() {
  const { accounts } = useAccount()

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <CardTitle>Accounts</CardTitle>
        <CreateAccountDialog />
      </CardHeader>
      <CardContent className="grid-cols-3-1 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((a) => (
          <Card key={a.id} className="gap-1">
            <CardHeader>
              <CardTitle>{a.name}</CardTitle>
            </CardHeader>
            <CardContent
              className={cn(
                "text-2xl",
                a.balance >= 0 ? "text-green-600" : "text-destructive"
              )}
            >
              {formatMoney(Math.abs(a.balance))}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
