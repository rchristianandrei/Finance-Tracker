import z from "zod"

export const transferBalanceSchema = z
  .object({
    fromAccountId: z.number({
      error: "From Account is required",
    }),
    toAccountId: z.number({
      error: "To Account is required",
    }),
    amount: z.number({
      error: "Amount is required",
    }),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: "To Account cannot be the same as From Account",
    path: ["toAccountId"],
  })

export type TransferBalanceFormValues = z.infer<typeof transferBalanceSchema>
