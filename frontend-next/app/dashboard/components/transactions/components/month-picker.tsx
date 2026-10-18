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

  const years = ["2026", "2027", "2028", "2029", "2030"]

  return (
    <Card>
      <CardContent className="flex items-center gap-1">
        <Select
          value={month.getMonth().toString()}
          onValueChange={(value) => {
            const newMonth = Number(value)
            setMonth(new Date(new Date().getFullYear(), newMonth, 1))
          }}
        >
          <SelectTrigger className="w-30">
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
        <Select
          value={month.getFullYear().toString()}
          onValueChange={(value) => {
            const newYear = Number(value)
            setMonth(new Date(newYear, month.getMonth(), 1))
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>

          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
