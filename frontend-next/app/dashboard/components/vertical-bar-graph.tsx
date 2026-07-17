import { CategorySummary } from "@/types/dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TransactionBadge } from "@/components/transaction/transcation-badge"

export function VerticalBarGraph({
  categorySummaries,
  type,
}: {
  categorySummaries: CategorySummary[]
  type: "income" | "expense"
}) {
  return (
    <div className="flex flex-col gap-2">
      {categorySummaries.map((categorySummary) => (
        <Card
          key={categorySummary.category}
          className="relative overflow-hidden"
        >
          <div
            className={cn(
              "absolute inset-y-0 left-0",
              type === "income" ? "bg-green-500/20" : "bg-destructive/20"
            )}
            style={{ width: `${categorySummary.percentage}%` }}
          />
          <CardContent
            className={cn(
              "grid grid-cols-[1fr_auto] items-center",
              type === "income" ? "*:text-green-500" : "*:text-destructive"
            )}
          >
            <p className="truncate">{categorySummary.category}</p>
            <div className="flex flex-col gap-1 text-right">
              <div>
                <TransactionBadge type={type}>
                  {categorySummary.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TransactionBadge>
              </div>
              <div>{categorySummary.percentage.toFixed(2)} %</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
