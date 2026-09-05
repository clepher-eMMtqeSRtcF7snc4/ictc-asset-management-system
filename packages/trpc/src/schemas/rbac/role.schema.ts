import { z } from 'zod';

export const ROLE_STATUSES = ['active', 'inactive'] as const;
export type RoleStatus = typeof ROLE_STATUSES[number];

export const roleStatusSchema = z.enum(ROLE_STATUSES);

export const rbacRoleSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  status: roleStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const roleListOutputSchema = z.object({
  data: z.array(rbacRoleSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const createRoleInputSchema = z.object({
  code: z.string().min(1, "Role code is required"),
  name: z.string().min(1, "Role name is required"),
  description: z.string().nullable().optional(),
  status: roleStatusSchema.default('active'),
  permissionIds: z.array(z.string().uuid()).optional(),
});

export const updateRoleInputSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: roleStatusSchema.optional(),
  permissionIds: z.array(z.string().uuid()).optional(),
});

export const assignRoleInputSchema = z.object({
  userId: z.string(),
  roleId: z.string().uuid(),
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

  export type Role = z.infer<typeof roleSchema>;
