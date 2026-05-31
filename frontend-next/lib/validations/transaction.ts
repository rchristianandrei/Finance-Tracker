import z from "zod"

export const transactionSchema = z.object({
  type: z.enum(["expense", "income"]),

  category: z.string().min(1, "Category is required"),

  description: z.string().min(1, "Description is required"),

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
