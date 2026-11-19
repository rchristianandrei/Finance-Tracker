import { Account } from "./account"
import { Category } from "./category"
import { TransactionTypeLabel, TransactionTypeRaw } from "./transaction-type"

export type BaseTransaction = {
  id: number
  date: Date
  dashboardDate?: Date
  fromAccount: Account | null
  toAccount: Account | null
  category: Category | null
  description: string | null
  amount: number
}
export type TransactionRaw = BaseTransaction & {
  type: TransactionTypeRaw
}
export type Transaction = BaseTransaction & {
  type: TransactionTypeLabel
}
