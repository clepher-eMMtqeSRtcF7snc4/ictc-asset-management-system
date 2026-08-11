import z from "zod";

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

export type UserIdInput = z.infer<typeof userIdSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UserProfile = z.infer<typeof userProfileSchema>