import { Category, TransactionType } from "./category"

export type Transaction = {
  id: number
  date: Date
  type: TransactionType
  category: Category
  description: string
  amount: number
}
