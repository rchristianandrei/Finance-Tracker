import { TransactionType } from "./category"

export type Transaction = {
  id: number
  date: Date
  type: TransactionType
  category: string
  description: string
  amount: number
}
