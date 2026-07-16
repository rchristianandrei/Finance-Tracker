import { CategorySummary } from "@/types/dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function VerticalBarGraph({
  categorySummaries,
}: {
  categorySummaries: CategorySummary[]
}) {
  return (
    <div className="flex flex-col gap-2">
      {categorySummaries.map((categorySummary) => (
        <Card
          key={categorySummary.category}
          className="relative overflow-hidden"
        >
          <div
            className="absolute inset-y-0 left-0 bg-destructive/20"
            style={{ width: `${categorySummary.percentage}%` }}
          />
          <CardContent className="grid grid-cols-[1fr_auto] items-center *:text-destructive">
            <p className="truncate">{categorySummary.category}</p>
            <div className="flex flex-col gap-1 text-right">
              <div>
                <span
                  className={cn(
                    "rounded-full px-2 py-1 font-medium dark:bg-red-900 dark:text-red-300"
                  )}
                >
                  {categorySummary.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div>{categorySummary.percentage.toFixed(2)} %</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
