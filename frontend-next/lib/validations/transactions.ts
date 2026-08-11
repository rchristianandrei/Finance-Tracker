import z from "zod"

const transactionFields = {
  categoryId: z.number().min(1, "Category is required"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(30, "Description must be 30 characters or less"),

  amount: z
    .number({
      error: "Amount is required",
    })
    .positive("Amount must be greater than 0"),

  date: z.date({
    error: "Date is required",
  }),
}

export const incomeTransactionSchema = z.object({
  ...transactionFields,
  toAccountId: z.number().min(1, "To Account is required"),
})

export const expenseTransactionSchema = z.object({
  ...transactionFields,
  fromAccountId: z.number().min(1, "From Account is required"),
})

export const transferTransactionSchema = z
  .object({
    fromAccountId: z.number().min(1, "From Account is required"),
    toAccountId: z.number().min(1, "To Account is required"),

    description: transactionFields.description,
    amount: z.number(),
    date: transactionFields.date,
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: "To Account cannot be the same as From Account",
    path: ["toAccountId"],
  })

export type IncomeTransactionFormValues = z.infer<
  typeof incomeTransactionSchema
>

export type ExpenseTransactionFormValues = z.infer<
  typeof expenseTransactionSchema
>

export type TransferTransactionFormValues = z.infer<
  typeof transferTransactionSchema
>
