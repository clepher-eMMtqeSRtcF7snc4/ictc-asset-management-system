import z from "zod";

export const supplierStatusSchema = z.enum(["active", "inactive"]);

export const supplierFiledSchema = z.object({
    name: z.string().trim().min(1, "This field is required").max(255),
    code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
    businessRegistrationNo: z.string().trim().optional().nullable(),
    philGEPsNo: z.string().trim().optional().nullable(),
    TIN: z.string().trim().optional().nullable(),
    VAT: z.boolean(),
    description: z.string().trim().max(500).optional().nullable(),
    status: supplierStatusSchema,
});

export const supplierSchema = supplierFiledSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const supplierFilterInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: supplierStatusSchema.optional(),
  })
  .default({});

export const createSupplierInputSchema = supplierFiledSchema;
export const updateSupplierInputSchema = supplierSchema
  .partial()
  .refine(
    ({ name, code, businessRegistrationNo, philGEPsNo, TIN, VAT, description, status }) =>
      name !== undefined ||
      code !== undefined ||
      businessRegistrationNo !== undefined ||
      philGEPsNo !== undefined ||
      TIN !== undefined ||
      VAT !== undefined ||
      description !== undefined ||
      status !== undefined,
    { message: "Provide at least one field to update" }
  );

export const supplierStatusOutputSchema = z.array(supplierSchema);

export const activeSupplierListOutputSchema = z.array(
  z.object({
    id: z.number().int().positive(),
    name: z.string().trim().min(1, "This field is required").max(255),
  }),
);

export type Supplier = z.infer<typeof supplierSchema>;
export type CreateSupplierInput = z.infer<typeof createSupplierInputSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierInputSchema>;
export type ActiveSupplier = z.infer<typeof activeSupplierListOutputSchema>[number];