import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AccountBalance } from "@/types/dashboard"
import { ChevronRight, CreditCard } from "lucide-react"

export function Accounts({
  accountSummaries,
}: {
  accountSummaries: AccountBalance[]
}) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <CreditCard></CreditCard>
        <CardTitle>My Accounts</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accountSummaries.map((a) => (
          <Card key={a.accountId} className="">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-lg font-bold">{a.accountName}</p>
                <div className="cursor-pointer rounded-full p-1 transition-colors hover:bg-muted">
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-2xl font-semibold">
                  {a.balance.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Current Balance</p>
              </div>

              <div className="mt-4 flex gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Income</p>
                  <p className="font-medium text-green-600">
                    +{a.totalIncome.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Expense</p>
                  <p className="font-medium text-red-600">
                    -{a.totalExpense.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
