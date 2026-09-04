import { z } from 'zod';

export const rbacPermissionSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  module: z.string(),
  action: z.string(),
});

export const permissionListOutputSchema = z.object({
  data: z.array(rbacPermissionSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const createPermissionInputSchema = z.object({
  code: z.string().min(1, "Permission code is required"),
  name: z.string().min(1, "Permission name is required"),
  description: z.string().nullable().optional(),
  module: z.string().min(1, "Module is required"),
  action: z.string().min(1, "Action is required"),
});

export const updatePermissionInputSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  module: z.string().min(1).optional(),
  action: z.string().min(1).optional(),
});