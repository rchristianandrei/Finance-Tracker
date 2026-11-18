import z from "zod"

const transactionFields = {
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

const categoryField = {
  categoryId: z.number().min(1, "Category is required"),
}

const fromAccountField = {
  fromAccountId: z
    .number({
      error: "From Account is required",
    })
    .min(1, "From Account is required"),
}

const toAccountField = {
  toAccountId: z
    .number({
      error: "To Account is required",
    })
    .min(1, "To Account is required"),
}

export const transactionSchema = z.discriminatedUnion("type", [
  // Income
  z.object({
    ...transactionFields,
    ...categoryField,
    type: z.literal("income"),
    ...toAccountField,
  }),

  // Expense
  z.object({
    ...transactionFields,
    ...categoryField,
    type: z.literal("expense"),
    ...fromAccountField,
    dashboardDate: z.date().optional(),
  }),

  // Transfer
  z
    .object({
      type: z.literal("transfer"),
      ...fromAccountField,
      ...toAccountField,
      ...transactionFields,
    })
    .refine((data) => data.fromAccountId !== data.toAccountId, {
      message: "To Account cannot be the same as From Account",
      path: ["toAccountId"],
    }),
])

export type TransactionFormValues = z.infer<typeof transactionSchema>
