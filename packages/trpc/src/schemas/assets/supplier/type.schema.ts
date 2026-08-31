import z from "zod";

export const supplierTypeStatusSchema = z.enum(["active", "inactive"]);

const supplierTypeFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  description: z.string().trim().max(500).optional().nullable(),
  status: supplierTypeStatusSchema,
});

export const supplierTypeSchema = supplierTypeFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const supplierTypeFilterInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: supplierTypeStatusSchema.optional(),
  })
  .default({});

export const createSupplierTypeInputSchema = supplierTypeFieldsSchema;
export const updateSupplierTypeInputSchema = supplierTypeSchema
  .partial()
  .refine(({name, code, description, status}) => 
    name !== undefined ||
    code !== undefined ||
    description !== undefined ||
    status !== undefined,
    {message: "Provide at least one field to update"}
  );

export const supplierTypeOutputSchema = z.array(supplierTypeSchema);

export type SupplierType = z.infer<typeof supplierTypeSchema>;
export type CreateSupplierTypeInput = z.infer<typeof createSupplierTypeInputSchema>;
export type UpdateSupplierTypeInput = z.infer<typeof updateSupplierTypeInputSchema>;