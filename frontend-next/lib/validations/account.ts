import z from "zod"

export const accountSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(20, "Name must be 20 characters or less"),
  isDefault: z.boolean(),
})

export type AccountFormValues = z.infer<typeof accountSchema>
