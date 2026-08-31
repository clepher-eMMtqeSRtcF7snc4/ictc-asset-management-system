import z from "zod";

export const businessTypeStatusSchema = z.enum(["active", "inactive"]);

const businessTypeFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  description: z.string().trim().max(500).optional().nullable(),
  status: businessTypeStatusSchema,
});

export const businessTypeSchema = businessTypeFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const businessTypeFilterInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: businessTypeStatusSchema.optional(),
  })
  .default({});

export const createBusinessTypeInputSchema = businessTypeFieldsSchema;
export const updateBusinessTypeInputSchema = businessTypeSchema
  .partial()
  .refine(({name, code, description, status}) => 
    name !== undefined ||
    code !== undefined ||
    description !== undefined ||
    status !== undefined,
    {message: "Provide at least one field to update"}
  );

export const businessTypeOutputSchema = z.array(businessTypeSchema);

export type businessType = z.infer<typeof businessTypeSchema>;
export type CreateBusinessTypeInput = z.infer<typeof createBusinessTypeInputSchema>;
export type UpdateBusinessTypeInput = z.infer<typeof updateBusinessTypeInputSchema>;