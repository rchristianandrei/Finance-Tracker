import { AccountSummary } from "@/types/dashboard"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

export function PieGraph({
  transactionBreakdown,
  cellColors,
}: {
  transactionBreakdown: AccountSummary[]
  cellColors: string[]
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={transactionBreakdown}
          dataKey="amount"
          nameKey="accountName"
          outerRadius={110}
          label={(props) => {
            const { accountName, amount } = props.payload
            return `${amount} (${accountName[0]})`
          }}
          labelLine={false}
        >
          {transactionBreakdown.map((_, index) => (
            <Cell key={index} fill={cellColors[index % cellColors.length]} />
          ))}
          <Tooltip />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
