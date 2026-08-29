import z from "zod";

export const settingsAssetStatusStatusSchema = z.enum(["active", "inactive"]);

const assetStatusFieldsSchema = z.object({
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

export const settingsAssetStatusSchema = assetStatusFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const createAssetStatusInputSchema = assetStatusFieldsSchema;

export const updateAssetStatusInputSchema = settingsAssetStatusSchema
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
export type CreateAssetStatusInput = z.infer<typeof createAssetStatusInputSchema>;
export type UpdateAssetStatusInput = z.infer<typeof updateAssetStatusInputSchema>;