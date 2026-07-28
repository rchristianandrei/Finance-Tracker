import { Account } from "./account"
import { Category, TransactionType } from "./category"

export type Transaction = {
  id: number
  date: Date
  type: TransactionType
  account: Account
  category: Category
  description: string
  amount: number
}
