import { Account } from "@/types/account"
import { AccountSummary } from "@/types/dashboard"
import {
  ResponsiveContainer,
  Bar,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

export function HorizontalBarGraph({
  transactionBreakdown,
  cellColors,
}: {
  transactionBreakdown: AccountSummary[]
  cellColors: string[]
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={transactionBreakdown}
        layout="horizontal"
        margin={{ top: 8, right: 16, left: 16, bottom: 8 }}
      >
        <YAxis type="number" />
        <XAxis type="category" dataKey="accountName" width={100} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null

            const item: AccountSummary = payload[0].payload

            return (
              <div className="rounded-lg border bg-background p-3 shadow">
                <p className="font-medium">{item.accountName}</p>
                <p>
                  {item.amount.toLocaleString()} ({item.percentage.toFixed(2)}%)
                </p>
              </div>
            )
          }}
        />

        <Bar dataKey="amount">
          {transactionBreakdown.map((_, index) => (
            <Cell key={index} fill={cellColors[index % cellColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
