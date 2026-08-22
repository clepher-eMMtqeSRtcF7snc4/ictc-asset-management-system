import z from "zod";
import { employeeSchema } from "./employee.schema";

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
  employee: employeeSchema.optional(),
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


export type UserIdInput = z.infer<typeof userIdSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UserProfile = z.infer<typeof userProfileSchema>


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