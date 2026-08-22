import { z } from 'zod';

export const employeeStatusSchema = z.enum([
  'active',
  'inactive',
  'retire',
]);

export const employeeFieldsSchema = z.object({
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  email: z.string().email(),
  position: z.string(),
  designation: z.string(),
  departmentId: z.number().int().positive(),
  status: employeeStatusSchema,
  photo: z.string().nullable(),
});

export const employeeSchema = employeeFieldsSchema.extend({
  id: z.number().int().positive(),
  status: employeeStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const employeeListInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: employeeStatusSchema.optional(),
    officeId: z.number().int().positive().optional(),
  })
  .default({});

export const createEmployeeSchema = employeeSchema;

export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployeeInput = z.infer<typeof employeeFieldsSchema>;
