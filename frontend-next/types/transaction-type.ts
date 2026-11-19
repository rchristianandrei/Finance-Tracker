export type TransactionTypeRaw = 1 | 2 | 3
export const transactionTypes = ["expense", "income", "transfer"] as const
export type TransactionTypeLabel = (typeof transactionTypes)[number]

export const transactionTypeMap: Record<
  TransactionTypeRaw,
  TransactionTypeLabel
> = {
  1: "expense",
  2: "income",
  3: "transfer",
}

export const transactionTypeReverseMap: Record<
  TransactionTypeLabel,
  TransactionTypeRaw
> = {
  expense: 1,
  income: 2,
  transfer: 3,
}
