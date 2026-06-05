import z from "zod"

export const categorySchema = z.object({
  type: z.enum(["1", "2"]),

  name: z.string().min(1, "Description is required"),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
