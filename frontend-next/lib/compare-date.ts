export function isSameISODate(date1: Date, date2: Date): boolean {
  return date1.toISOString().slice(0, 10) === date2.toISOString().slice(0, 10)
}
