import { formatMoney } from "@/lib/format-money"
import { CategorySummary } from "@/types/dashboard"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"

const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 20
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs"
    >
      {name} ({(percent * 100).toFixed(0)}%)
    </text>
  )
}

export function CategoryPieChart({
  transactionBreakdown,
  cellColors,
}: {
  transactionBreakdown: CategorySummary[]
  cellColors: string[]
}) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={transactionBreakdown}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={55} // Remove for a regular pie
          outerRadius={100}
          paddingAngle={2}
          label={renderLabel}
          labelLine
        >
          {transactionBreakdown.map((_, index) => (
            <Cell key={index} fill={cellColors[index % cellColors.length]} />
          ))}
        </Pie>

        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null

            const item = payload[0].payload as CategorySummary

            return (
              <div className="rounded-lg border bg-background p-3 shadow">
                <p className="font-medium">{item.category}</p>
                <p>
                  {formatMoney(item.amount)} ({item.percentage.toFixed(2)}%)
                </p>
              </div>
            )
          }}
        />

        <Legend verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  )
}
