import { Account } from "./account"
import { Category, TransactionType } from "./category"

export type Transaction = {
  id: number
  date: Date
  type: TransactionType
  fromAccount: Account | null
  toAccount: Account | null
  category: Category | null
  description: string | null
  amount: number
}
