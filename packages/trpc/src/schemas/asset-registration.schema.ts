import { z } from 'zod';

export const assetStatusSchema = z.enum(['draft', 'available', 'assigned']);

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const optionalDateSchema = dateSchema.optional().nullable();
const optionalText = (max: number) =>
  z.string().trim().min(1).max(max).optional().nullable();

export const assetRegistrationFieldsSchema = z.object({
  name: z.string().trim().min(1, 'This field is required').max(200),
  assetType: z.string().trim().min(1, 'This field is required').max(100),
  categoryId: z.number().int().positive(),
  departmentId: z.number().int().positive().optional().nullable(),
  locationId: z.number().int().positive().optional().nullable(),
  custodianId: z.string().trim().min(1).max(100).optional().nullable(),
  brand: z.string().trim().min(1, 'This field is required').max(100),
  model: z.string().trim().min(1, 'This field is required').max(100),
  description: optionalText(5_000),
  condition: z.string().trim().min(1, 'This field is required').max(100),
  serialNumber: optionalText(200),
  barcode: optionalText(200),
  partNumber: optionalText(200),
  acquisitionDate: dateSchema,
  purchaseDate: optionalDateSchema,
  acquisitionCost: z.number().finite().nonnegative(),
  supplier: optionalText(200),
  reference: optionalText(200),
  fundingSource: optionalText(200),
  warrantyStartDate: optionalDateSchema,
  warrantyEndDate: optionalDateSchema,
  usefulLife: z.number().int().positive().optional().nullable(),
  residualValue: z.number().finite().nonnegative().optional().nullable(),
  depreciationMethod: optionalText(100),
  imageUrl: z.string().trim().url().max(2_048).optional().nullable(),
});

export const previewRegistrationIdentifiersInputSchema = z.object({
  categoryId: z.number().int().positive(),
});

export const registrationIdentifiersSchema = z.object({
  assetTag: z.string(),
  propertyNumber: z.string(),
  qrValue: z.string(),
});

export const registerAssetInputSchema = assetRegistrationFieldsSchema.extend({
  status: assetStatusSchema.default('available'),
});

export const saveAssetDraftInputSchema = assetRegistrationFieldsSchema
  .partial()
  .extend({
    categoryId: z.number().int().positive(),
  });

export const assetSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().nullable(),
  assetType: z.string().nullable(),
  categoryId: z.number().int().positive(),
  departmentId: z.number().int().positive().nullable(),
  locationId: z.number().int().positive().nullable(),
  custodianId: z.string().nullable(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  description: z.string().nullable(),
  condition: z.string().nullable(),
  serialNumber: z.string().nullable(),
  barcode: z.string().nullable(),
  partNumber: z.string().nullable(),
  acquisitionDate: z.string().nullable(),
  purchaseDate: z.string().nullable(),
  acquisitionCost: z.number().nullable(),
  supplier: z.string().nullable(),
  reference: z.string().nullable(),
  fundingSource: z.string().nullable(),
  warrantyStartDate: z.string().nullable(),
  warrantyEndDate: z.string().nullable(),
  usefulLife: z.number().int().positive().nullable(),
  residualValue: z.number().nullable(),
  depreciationMethod: z.string().nullable(),
  imageUrl: z.string().nullable(),
  assetTag: z.string(),
  propertyNumber: z.string(),
  qrValue: z.string(),
  status: assetStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PreviewRegistrationIdentifiersInput = z.infer<
  typeof previewRegistrationIdentifiersInputSchema
>;
export type RegistrationIdentifiers = z.infer<
  typeof registrationIdentifiersSchema
>;
export type RegisterAssetInput = z.infer<typeof registerAssetInputSchema>;
export type SaveAssetDraftInput = z.infer<typeof saveAssetDraftInputSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type AssetStatus = z.infer<typeof assetStatusSchema>;
