import z from "zod";

export const settingsAssetTypeStatusSchema = z.enum(["active", "inactive"]);

const settingsAssetTypeFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  assetCategoryId: z.number().int().positive(),
  description: z.string().trim().max(500).optional().nullable(),
  depreciable: z.boolean(),
  defaultUsefulLife: z.number().int().positive().optional().nullable(),
  status: settingsAssetTypeStatusSchema,
});

export const settingsAssetTypeSchema = settingsAssetTypeFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const categoryListInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: settingsAssetTypeStatusSchema.optional(),
    category: z.string().trim().min(1).max(100).optional(),
  })
  .default({});

export const createSettingsAssetTypeInputSchema = settingsAssetTypeFieldsSchema;
export const updateSettingsAssetTypeInputSchema = settingsAssetTypeSchema
  .partial()
  .refine(({name, code, assetCategoryId, description, depreciable, defaultUsefulLife, status}) => 
    name !== undefined ||
    code !== undefined ||
    assetCategoryId !== undefined ||
    description !== undefined ||
    depreciable !== undefined ||
    defaultUsefulLife !== undefined ||
    status !== undefined,
    {message: "Provide at least one field to update"}
  );

export const assetTypeListOutputSchema = z.array(settingsAssetTypeSchema);

export type SettingsAssetType = z.infer<typeof settingsAssetTypeSchema>;
export type CreateSettingsAssetTypeInput = z.infer<typeof createSettingsAssetTypeInputSchema>;
export type UpdateSettingsAssetTypeInput = z.infer<typeof updateSettingsAssetTypeInputSchema>;