import z from "zod";

export const supplierStatusStatusSchema = z.enum(["active", "inactive"]);

const supplierStatusFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  description: z.string().trim().max(500).optional().nullable(),
  status: supplierStatusStatusSchema,
});

export const supplierStatusSchema = supplierStatusFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const supplierStatusFilterInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: supplierStatusStatusSchema.optional(),
  })
  .default({});

export const createSupplierStatusInputSchema = supplierStatusFieldsSchema;
export const updateSupplierStatusInputSchema = supplierStatusSchema
  .partial()
  .refine(
    ({ name, code, description, status }) =>
      name !== undefined ||
      code !== undefined ||
      description !== undefined ||
      status !== undefined,
    { message: "Provide at least one field to update" }
  );

export const supplierStatusOutputSchema = z.array(supplierStatusSchema);

export type SupplierStatus = z.infer<typeof supplierStatusSchema>;
export type CreateSupplierStatusInput = z.infer<typeof createSupplierStatusInputSchema>;
export type UpdateSupplierStatusInput = z.infer<typeof updateSupplierStatusInputSchema>;