import z from "zod";

export const supplierCategoryStatusSchema = z.enum(["active", "inactive"]);

const supplierCategoryFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  description: z.string().trim().max(500).optional().nullable(),
  status: supplierCategoryStatusSchema,
});

export const supplierCategorySchema = supplierCategoryFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const supplierCategoryFilterInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: supplierCategoryStatusSchema.optional(),
  })
  .default({});

export const createSupplierCategoryInputSchema = supplierCategoryFieldsSchema;
export const updateSupplierCategoryInputSchema = supplierCategorySchema
  .partial()
  .refine(({name, code, description, status}) => 
    name !== undefined ||
    code !== undefined ||
    description !== undefined ||
    status !== undefined,
    {message: "Provide at least one field to update"}
  );

export const supplierCategoryOutputSchema = z.array(supplierCategorySchema);

export type supplierCategory = z.infer<typeof supplierCategorySchema>;
export type CreateSupplierCategoryInput = z.infer<typeof createSupplierCategoryInputSchema>;
export type UpdateSupplierCategoryInput = z.infer<typeof updateSupplierCategoryInputSchema>;