import { z } from 'zod';

export const departmentStatusSchema = z.enum(['active', 'inactive']);

const departmentFieldsSchema = z.object({
  name: z.string().trim().min(1, 'This field is required').max(150),
  code: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores'),
  type: z.string().trim().min(1, 'This field is required').max(100),
});

export const departmentSchema = departmentFieldsSchema.extend({
  id: z.number().int().positive(),
  status: departmentStatusSchema,
});

export const departmentListInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: departmentStatusSchema.optional(),
    type: z.string().trim().min(1).max(100).optional(),
  })
  .default({});

export const departmentListOutputSchema = z.array(departmentSchema);

export const createDepartmentInputSchema = departmentFieldsSchema;

export const updateDepartmentInputSchema = departmentFieldsSchema
  .partial()
  .extend({
    id: z.number().int().positive(),
  })
  .refine(
    ({ name, code, type }) =>
      name !== undefined || code !== undefined || type !== undefined,
    { message: 'Provide at least one field to update' },
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