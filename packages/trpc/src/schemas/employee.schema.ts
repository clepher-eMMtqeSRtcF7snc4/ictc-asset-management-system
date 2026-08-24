import { z } from 'zod';

export const employeeStatusSchema = z.enum([
  'active',
  'inactive',
  'retire',
]);

export const employeeFieldsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().nullable(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  position: z.string().min(1, "Position is required"),
  designation: z.string().min(1, "Designation is required"),
  departmentId: z.number().int().positive(),
  role: z.enum(["supervisor", "custodian", "staff"]).optional().nullable(),
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
    departmentId: z.number().int().positive().optional(),
    position: z.string().trim().min(1).max(150).optional(),
    designation: z.string().trim().min(1).max(150).optional(),
    status: employeeStatusSchema.optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  })
  .default({});

export const employeeListOutputSchema = z.object({
  items: z.array(employeeSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export const createEmployeeInputSchema = employeeFieldsSchema;

export const updateEmployeeInputSchema = employeeFieldsSchema
  .partial()
  .extend({
    id: z.number().int().positive(),
  })
  .refine(
    ({ firstName, lastName, email, position, designation, departmentId, status, role }) =>
      firstName !== undefined ||
      lastName !== undefined ||
      email !== undefined ||
      position !== undefined ||
      designation !== undefined ||
      departmentId !== undefined ||
      status !== undefined ||
      role !== undefined,
    { message: "Provide at least one field to update" },
  );

export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeListInput = z.infer<typeof employeeListInputSchema>;
export type EmployeeListOutput = z.infer<typeof employeeListOutputSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeInputSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeInputSchema>;
