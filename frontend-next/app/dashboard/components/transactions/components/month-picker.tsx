import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dispatch, SetStateAction } from "react"

export function MonthPicker({
  month,
  setMonth,
}: {
  month: Date
  setMonth: Dispatch<SetStateAction<Date>>
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <Card>
      <CardContent>
        <Select
          value={month.getMonth().toString()}
          onValueChange={(value) => {
            const newMonth = Number(value)
            setMonth(new Date(new Date().getFullYear(), newMonth, 1))
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>

          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={i.toString()}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
