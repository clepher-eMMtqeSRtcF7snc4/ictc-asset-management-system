import z from "zod";

export const settingsAssetStatusStatusSchema = z.enum(["active", "inactive"]);

const settingsAssetStatusFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  description: z.string().trim().max(500).optional().nullable(),
  status: settingsAssetStatusStatusSchema,
});

export const settingsAssetStatusSchema = settingsAssetStatusFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const createSettingsAssetStatusInputSchema = settingsAssetStatusFieldsSchema;

export const updateSettingsAssetStatusInputSchema = settingsAssetStatusSchema
  .partial()
  .refine(
    ({ name, code, description, status }) =>
      name !== undefined ||
      code !== undefined ||
      description !== undefined ||
      status !== undefined,
    { message: "Provide at least one field to update" }
  );

export type SettingsAssetStatus = z.infer<typeof settingsAssetStatusSchema>;
export type CreateSettingsAssetStatusInput = z.infer<typeof createSettingsAssetStatusInputSchema>;
export type UpdateSettingsAssetStatusInput = z.infer<typeof updateSettingsAssetStatusInputSchema>;