import z from "zod";

export const fundSourceSchema = z.object({
  id: z.number(),
  label: z.string(),
  value: z.string().nullable()
})

export type FundSource = z.infer<typeof fundSourceSchema>