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
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  employeeId: z.number().int().nullable(),
  department: z
    .object({
      id: z.number().int().positive(),
      name: z.string(),
    })
    .nullable(),
  status: roleStatusSchema,
  roles: z.array(rbacRoleSchema),
});

export const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  employeeId: z.string().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export const userListOutputSchema = z.object({
  data: z.array(userWithRolesSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const createUserOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const currentUserOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  employeeId: z.number().int().nullable(),
  status: roleStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  roles: z.array(z.string()),
  isAdmin: z.boolean(),
});

export type UserIdInput = z.infer<typeof userIdSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UserProfile = z.infer<typeof userProfileSchema>
