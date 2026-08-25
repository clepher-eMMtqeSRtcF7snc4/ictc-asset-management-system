import { z } from 'zod';

export const employeeStatusSchema = z.enum([
  'active',
  'casual',
  'contractual',
  'deceased',
  'end-of-contract',
  'inactive',
  'on-leave',
  'permanent',
  'probationary',
  'retired',
  'suspended',
  'temporary',
  'terminated',
]);

export const employeeFieldsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().nullable(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  position: z.string().nullable(),
  designation: z.string().nullable(),
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
    positionId: z.string().trim().min(1).max(150).optional(),
    designationId: z.string().trim().min(1).max(150).optional(),
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
    ({ firstName, lastName, email, position, designation, departmentId, status, role, photo }) =>
      firstName !== undefined ||
      lastName !== undefined ||
      email !== undefined ||
      position !== undefined ||
      designation !== undefined ||
      departmentId !== undefined ||
      status !== undefined ||
      role !== undefined ||
      photo !== undefined,
    { message: "Provide at least one field to update" },
  );

export const employeeSettingStatusSchema = z.enum(["active", "inactive"]);

export const positionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  status: employeeSettingStatusSchema,
  employeeCount: z.number().int().nonnegative(),
});

export const positionListInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: employeeSettingStatusSchema.optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  })
  .default({});

export const positionListOutputSchema = z.object({
  items: z.array(positionSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export const createPositionInputSchema = z.object({
  name: z.string().min(1, "Position name is required"),
  status: employeeSettingStatusSchema,
});

export const updatePositionInputSchema = createPositionInputSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
});

export const designationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  status: employeeSettingStatusSchema,
  employeeCount: z.number().int().nonnegative(),
});

export const designationListInputSchema = positionListInputSchema;

export const designationListOutputSchema = z.object({
  items: z.array(designationSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export const createDesignationInputSchema = z.object({
  name: z.string().min(1, "Designation name is required"),
  status: employeeSettingStatusSchema,
});

export const updateDesignationInputSchema = createDesignationInputSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
});

export const employeeSettingStatusItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  status: employeeSettingStatusSchema,
  employeeCount: z.number().int().nonnegative(),
});

export const createStatusInputSchema = z.object({
  name: z.string().min(1, "Status name is required"),
  value: z.string().min(1, "Status value is required"),
  status: employeeSettingStatusSchema,
});

export const updateStatusInputSchema = createStatusInputSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
});

export type Employee = z.infer<typeof employeeSchema>;
export type EmployeeListInput = z.infer<typeof employeeListInputSchema>;
export type EmployeeListOutput = z.infer<typeof employeeListOutputSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeInputSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeInputSchema>;
export type Position = z.infer<typeof positionSchema>;
export type PositionListInput = z.infer<typeof positionListInputSchema>;
export type PositionListOutput = z.infer<typeof positionListOutputSchema>;
export type CreatePositionInput = z.infer<typeof createPositionInputSchema>;
export type UpdatePositionInput = z.infer<typeof updatePositionInputSchema>;
export type Designation = z.infer<typeof designationSchema>;
export type DesignationListInput = z.infer<typeof designationListInputSchema>;
export type DesignationListOutput = z.infer<typeof designationListOutputSchema>;
export type CreateDesignationInput = z.infer<typeof createDesignationInputSchema>;
export type UpdateDesignationInput = z.infer<typeof updateDesignationInputSchema>;
export type EmployeeSettingStatus = z.infer<typeof employeeSettingStatusItemSchema>;
export type CreateStatusInput = z.infer<typeof createStatusInputSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusInputSchema>;
