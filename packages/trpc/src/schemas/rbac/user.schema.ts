import z from "zod";
import { roleStatusSchema, rbacRoleSchema } from "./role.schema";

export const userIdSchema = z.object({
  userId: z.string(),
})

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(50, "Maximum 50 characters"),
});

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
});

export const createUserSchema = userProfileSchema.extend({
  userId: z.string().trim().min(1).max(100).optional(),
});

export const updateUserSchema = userProfileSchema
  .partial()
  .extend({
    id: z.string().trim().min(1).max(100),
  })
  .refine(
    ({ id: _id, ...updates }) => Object.values(updates).some((value) => value !== undefined),
    { message: 'Provide at least one field to update' },
  );

export const userWithRolesSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  employeeId: z.number().int().nullable(),
  status: roleStatusSchema,
  roles: z.array(rbacRoleSchema),
});

export const userListOutputSchema = z.object({
  data: z.array(userWithRolesSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});


export type UserIdInput = z.infer<typeof userIdSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UserProfile = z.infer<typeof userProfileSchema>
