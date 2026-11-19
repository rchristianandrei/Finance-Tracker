import { TransactionTypeLabel, TransactionTypeRaw } from "./transaction-type"

export type BaseCategory = {
  id: number
  name: string
}

export type CategoryRaw = BaseCategory & {
  type: TransactionTypeRaw
}

export type Category = BaseCategory & {
  type: TransactionTypeLabel
}
