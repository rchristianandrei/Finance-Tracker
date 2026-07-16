import { CategorySummary } from "@/types/dashboard"
import { Card, CardContent } from "@/components/ui/card"

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
          <CardContent className="grid grid-cols-[1fr_10%_10%] *:text-destructive">
            <div>{categorySummary.category}</div>
            <div className="text-right">
              {categorySummary.amount.toFixed(2)}{" "}
            </div>
            <div className="text-right">
              {categorySummary.percentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
