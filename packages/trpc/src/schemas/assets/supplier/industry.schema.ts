import z from "zod";

export const industryStatusSchema = z.enum(["active", "inactive"]);

const industryFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  description: z.string().trim().max(500).optional().nullable(),
  status: industryStatusSchema,
});

export const industrySchema = industryFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const industryFilterInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: industryStatusSchema.optional(),
  })
  .default({});

export const createIndustryInputSchema = industryFieldsSchema;
export const updateIndustryInputSchema = industrySchema
  .partial()
  .refine(({name, code, description, status}) => 
    name !== undefined ||
    code !== undefined ||
    description !== undefined ||
    status !== undefined,
    {message: "Provide at least one field to update"}
  );

export const industryOutputSchema = z.array(industrySchema);

export type industry = z.infer<typeof industrySchema>;
export type CreateIndustryInput = z.infer<typeof createIndustryInputSchema>;
export type UpdateIndustryInput = z.infer<typeof updateIndustryInputSchema>;