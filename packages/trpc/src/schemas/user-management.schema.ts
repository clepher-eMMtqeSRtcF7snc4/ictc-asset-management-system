import { z } from 'zod';

export const userManagementStatusSchema = z.enum([
  'active',
  'inactive',
  'suspended',
]);

const nameSchema = z.string().trim().min(1, 'This field is required').max(100);
const optionalTextSchema = z.string().trim().min(1).max(150);

export const userManagementUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  email: z.string().email(),
  position: z.string(),
  designation: z.string(),
  office: z.string(),
  departmentId: z.number().int().positive().nullable(),
  departmentName: z.string().nullable(),
  roleId: z.string().nullable(),
  roleName: z.string().nullable(),
  status: userManagementStatusSchema,
  profilePicture: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userManagementListInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: userManagementStatusSchema.optional(),
    departmentId: z.number().int().positive().optional(),
  })
  .default({});

export const userManagementSummarySchema = z.object({
  totalUsers: z.number().int().nonnegative(),
  activeUsers: z.number().int().nonnegative(),
  inactiveUsers: z.number().int().nonnegative(),
  suspendedUsers: z.number().int().nonnegative(),
  totalRoles: z.number().int().nonnegative(),
});

const userProfileFieldsSchema = z.object({
  firstName: nameSchema,
  middleName: nameSchema.optional().nullable(),
  lastName: nameSchema,
  position: optionalTextSchema,
  designation: optionalTextSchema,
  office: optionalTextSchema,
  departmentId: z.number().int().positive(),
  email: z.string().trim().email().max(320),
  roleId: z.string().trim().min(1).max(100),
  status: userManagementStatusSchema.default('active'),
  profilePicture: z.string().trim().url().max(2048).optional().nullable(),
});

export const createUserSchema = userProfileFieldsSchema.extend({
  userId: z.string().trim().min(1).max(100).optional(),
});

export const updateUserSchema = userProfileFieldsSchema
  .partial()
  .extend({
    id: z.string().trim().min(1).max(100),
  })
  .refine(
    ({ id: _id, ...updates }) => Object.values(updates).some((value) => value !== undefined),
    { message: 'Provide at least one field to update' },
  );

export const setUserStatusSchema = z.object({
  id: z.string().trim().min(1).max(100),
  status: userManagementStatusSchema,
});

const roleFieldsSchema = z.object({
  name: z.string().trim().min(1, 'This field is required').max(100),
  description: z.string().trim().max(500).optional().nullable(),
  permissions: z.array(z.string().trim().min(1).max(150)).max(200),
});

export const roleSchema = roleFieldsSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createRoleSchema = roleFieldsSchema;

export const updateRoleSchema = roleFieldsSchema
  .partial()
  .extend({
    id: z.string().trim().min(1).max(100),
  })
  .refine(
    ({ id: _id, ...updates }) => Object.values(updates).some((value) => value !== undefined),
    { message: 'Provide at least one field to update' },
  );

export const auditLogSchema = z.object({
  id: z.string(),
  actorUserId: z.string().nullable(),
  actorName: z.string().nullable(),
  userId: z.string().nullable(),
  userName: z.string().nullable(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.date(),
});

export const auditLogListInputSchema = z
  .object({
    userId: z.string().trim().min(1).max(100).optional(),
    action: z.string().trim().min(1).max(100).optional(),
    limit: z.number().int().min(1).max(200).default(50),
  })
  .default({ limit: 50 });

export type UserManagementListInput = z.infer<
  typeof userManagementListInputSchema
>;
export type UserManagementUser = z.infer<typeof userManagementUserSchema>;
export type Role = z.infer<typeof roleSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type SetUserStatusInput = z.infer<typeof setUserStatusSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type AuditLogListInput = z.infer<typeof auditLogListInputSchema>;
