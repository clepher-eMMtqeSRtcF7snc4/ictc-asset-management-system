import { z } from "zod";

export const settingsAssetCategoryStatusSchema = z.enum(["active", "inactive"]);

const settingsAssetCategoryFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  description: z.string().trim().max(500).optional().nullable(),
  status: settingsAssetCategoryStatusSchema,
});

export const settingsAssetCategorySchema = settingsAssetCategoryFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
});

export const settingsCategoryListInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: settingsAssetCategoryStatusSchema.optional(),
    type: z.string().trim().min(1).max(100).optional(),
  })
  .default({});

export const settingsAssetCreateCategoryInputSchema = settingsAssetCategoryFieldsSchema;
export const settingsAssetUpdateCategoryInputSchema = settingsAssetCategoryFieldsSchema
  .partial()
  .extend({
    id: z.number().int().positive(),
  })
  .refine(
    ({ name, description }) =>
      name !== undefined ||
      description !== undefined ||
    { message: "Provide at least one field to update" },
  );

  export const settingsAssetCategoryListSchema = z.object({
    items: z.array(settingsAssetCategorySchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
  });

export type SettingsAssetCategory = z.infer<typeof settingsAssetCategorySchema>;
export type CategoryListInput = z.infer<typeof settingsAssetCategorySchema>;
export type CreateCategoryInput = z.infer<typeof settingsAssetCreateCategoryInputSchema>;
export type UpdateCategoryInput = z.infer<typeof settingsAssetUpdateCategoryInputSchema>;

export const assetSettingsMockCategories: SettingsAssetCategory[] = [
  { id: 1, name: "IT Equipment", description: "Portable computer devices", status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 2, name: "Furniture", description: "Stationary computer systems", status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 3, name: "Laboratory Equipment", description: "Display screens and monitors", status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 4, name: "Office Supplies", description: "Printing devices", status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 5, name: "Server", description: "Server hardware and rack units", status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
  { id: 6, name: "Network Switch", description: "Network switching equipment", status: "active", createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null },
];