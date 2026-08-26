import { z } from "zod";

export const categoryStatusSchema = z.enum(["active", "inactive"]);

const categoryFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  type: z.enum(["", "Asset", "Equipment", "Furniture", "Other"]),
  description: z.string().trim().max(500).optional().nullable(),
  depreciable: z.boolean(),
  defaultUsefulLife: z.number().int().positive().optional().nullable(),
  status: categoryStatusSchema,
});

export const categorySchema = categoryFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const categoryListInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: categoryStatusSchema.optional(),
    type: z.string().trim().min(1).max(100).optional(),
  })
  .default({});

export const categoryListOutputSchema = z.array(categorySchema);

export const createCategoryInputSchema = categoryFieldsSchema;

export const updateCategoryInputSchema = categoryFieldsSchema
  .partial()
  .extend({
    id: z.number().int().positive(),
  })
  .refine(
    ({ name, code, type, description, depreciable, defaultUsefulLife }) =>
      name !== undefined ||
      code !== undefined ||
      type !== undefined ||
      description !== undefined ||
      depreciable !== undefined ||
      defaultUsefulLife !== undefined,
    { message: "Provide at least one field to update" },
  );

// export const setCategoryStatusInputSchema = z.object({
//   id: z.number().int().positive(),
//   status: categoryStatusSchema,
// });

export type Category = z.infer<typeof categorySchema>;
export type CategoryListInput = z.infer<typeof categoryListInputSchema>;
export type CategoryListOutput = z.infer<typeof categoryListOutputSchema>;
export type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategoryInputSchema>;
// export type SetCategoryStatusInput = z.infer<
//   typeof setCategoryStatusInputSchema
// >;

// Added for form schema
// export const categoryFormSchema = categoryFieldsSchema.extend({
//   status: categoryStatusSchema,
// });

// export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const mockCategories: Category[] = [
  { id: 1, code: "ICT-LAPTOP", name: "Laptop", type: "Asset", description: "Portable computer devices", depreciable: true, defaultUsefulLife: 3, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 2, code: "ICT-DESKTOP", name: "Desktop", type: "Asset", description: "Stationary computer systems", depreciable: true, defaultUsefulLife: 5, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 3, code: "ICT-MONITOR", name: "Monitor", type: "Equipment", description: "Display screens and monitors", depreciable: true, defaultUsefulLife: 5, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 4, code: "ICT-PRINTER", name: "Printer", type: "Equipment", description: "Printing devices", depreciable: true, defaultUsefulLife: 5, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 5, code: "ICT-SERVER", name: "Server", type: "Asset", description: "Server hardware and rack units", depreciable: true, defaultUsefulLife: 5, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 6, code: "NET-SWITCH", name: "Network Switch", type: "Equipment", description: "Network switching equipment", depreciable: true, defaultUsefulLife: 5, status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
];