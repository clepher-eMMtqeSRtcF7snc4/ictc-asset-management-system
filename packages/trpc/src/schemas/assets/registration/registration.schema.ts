import z from "zod";

export const assetInformationSchema = z.object({
  assetName: z.string().trim().min(1, "This field is required"),
  brand: z.string().min(1, "This field is required"),
  model: z.string().min(1, "This field is required"),
  serialNumber: z.string().min(1, "This field is required"),
  propertyNumber: z.string().min(1, "This field is required"),
  qrCode: z.string().min(1, "This field is required"),
  description: z.string().optional(),
  quantity: z.number().int().positive().min(1),
  assetPhoto: z.string().nullable(),
  categoryId: z.number().int().positive(),
  assetTypeId: z.number().int().positive(),
  conditionId: z.number().int().positive()
});

export const assetAcquisitionSchema = z.object({
  acquisitionDate: z.date("This field is required"),
  acquisitionCost: z.number("This field is required").min(0,"This field is required"),
  supplierId: z.number().optional(),
  purchaseOrderNumber: z.string().optional(),
  warranty: z.number().optional(),
  supportingDocs: z.string().min(1, "This field is required")
})

export const assetLocationAssignment = z.object({
    departmentId: z.number().int().positive().min(1, "This field is required"),
    custodianId: z.number().int().positive().min(1, "This field is required"),
    buildingId: z.number().int().positive().optional(),
    roomId: z.number().int().positive().optional(),
  });

export const assetRegistrationSchema = assetInformationSchema
  .merge(assetAcquisitionSchema)
  .merge(assetLocationAssignment)


export type AssetRegistration = z.infer<typeof assetInformationSchema>
export type AssetAcquisitionSchema = z.infer<typeof assetAcquisitionSchema>
export type AssetLocationAssignment = z.infer<typeof assetLocationAssignment>
export type AssetRegistrationInput = z.infer<typeof assetRegistrationSchema>
