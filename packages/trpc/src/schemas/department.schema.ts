import { z } from "zod";

export const departmentStatusSchema = z.enum(["active", "inactive"]);

const departmentFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  description: z.string().trim().max(500).optional().nullable(),
  supervisor: z.string().trim().optional().nullable(),
  custodian: z.string().trim().optional().nullable(),
  logo: z.string().nullable(),
  color: z.string().trim().nullable()
});

export const departmentSchema = departmentFieldsSchema.extend({
  id: z.number().int().positive(),
  status: departmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const departmentListInputSchema = z
  .object({
    search: z.string().trim().optional(),
    status: departmentStatusSchema.optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  })
  .default({});

export const departmentListOutputSchema = z.object({
  items: z.array(departmentSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export const createDepartmentInputSchema = departmentFieldsSchema;

export const updateDepartmentInputSchema = departmentFieldsSchema
  .extend({
    status: departmentStatusSchema.optional(),
  })
  .partial()
  .extend({
    id: z.number().int().positive(),
  })
  .refine(
    ({ name, code, description, supervisor, status }) =>
      name !== undefined ||
      code !== undefined ||
      description !== undefined ||
      supervisor !== undefined ||
      status !== undefined,
    { message: "Provide at least one field to update" },
  );

export const setDepartmentStatusInputSchema = z.object({
  id: z.number().int().positive(),
  status: departmentStatusSchema,
});

export type Department = z.infer<typeof departmentSchema>;
export type DepartmentListInput = z.infer<typeof departmentListInputSchema>;
export type DepartmentListOutput = z.infer<typeof departmentListOutputSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentInputSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentInputSchema>;
export type SetDepartmentStatusInput = z.infer<
  typeof setDepartmentStatusInputSchema
>;
