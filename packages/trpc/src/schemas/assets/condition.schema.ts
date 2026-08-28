import z from "zod";

export const assetConditionStatusSchema = z.enum(["active", "inactive"]);

const assetConditionFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  description: z.string().trim().max(500).optional().nullable(),
  status: assetConditionStatusSchema,
});

export const assetConditionSchema = assetConditionFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const CreateAssetConditionInputSchema = assetConditionFieldsSchema;

export const UpdateAssetConditionInputSchema = assetConditionSchema
  .partial()
  .refine(
    ({ name, code, description, status }) =>
      name !== undefined ||
      code !== undefined ||
      description !== undefined ||
      status !== undefined,
    { message: "Provide at least one field to update" }
  );

export type AssetCondition = z.infer<typeof assetConditionSchema>;
export type CreateAssetConditionInput = z.infer<typeof CreateAssetConditionInputSchema>;
export type UpdateAssetConditionInput = z.infer<typeof UpdateAssetConditionInputSchema>;