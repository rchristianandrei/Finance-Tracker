import z from "zod"

export const transactionSchema = z.object({
  type: z.enum(["1", "2"]),

  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be 50 characters or less"),

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
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
