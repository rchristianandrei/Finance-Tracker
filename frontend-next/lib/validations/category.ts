import z from "zod"

export const categorySchema = z.object({
  type: z.enum(["1", "2"]),

  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
