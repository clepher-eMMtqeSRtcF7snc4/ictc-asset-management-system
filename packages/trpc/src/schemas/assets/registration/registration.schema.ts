import z from "zod";

export const assetInformationSchema = z.object({
  assetName: z.string().trim().min(1, "This field is required"),
  brand: z.string().min(1, "This field is required"),
  model: z.string().min(1, "This field is required"),
  serialNumber: z.string().min(1, "This field is required"),
  qrCode: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().int().positive().min(1),
  assetPhoto: z.string().nullable(),
  categoryId: z.number().int().positive(),
  assetTypeId: z.number().int().positive(),
  conditionId: z.number().int().positive()
});

export const assetAcquisitionSchema = z.object({
  acquisitionDate: z.date("This field is required"),
  acquisitionCost: z.number().min(0,"This field is required"),
  supplierId: z.number().optional(),
  purchaseOrderNumber: z.string().optional(),
  warranty: z.string().optional(),
  supportingDocs: z.string().min(1, "This field is required")
})

export const assetLocationAssignment = z.object({
    departmentId: z.number().int().positive().min(1, "This field is required"),
    custodianId: z.number().int().positive().min(1, "This field is required"),
    buildingId: z.number().int().positive().optional(),
    roomId: z.number().int().positive().optional(),
  });

const assetRegistrationSchema = assetInformationSchema
  .extend(assetAcquisitionSchema)
  .extend(assetLocationAssignment)


export type AssetRegistration = z.infer<typeof assetInformationSchema>
export type AssetAcquisitionSchema = z.infer<typeof assetAcquisitionSchema>
export type AssetLocationAssignment = z.infer<typeof assetLocationAssignment>
export type AssetRegistrationInput = z.infer<typeof assetRegistrationSchema>


export type RegistrationFormValues = Record<string, string | undefined>;
export type StaticCategory = {
  id: number;
  name: string;
  code: string;
  type: string;
  status: "active" | "inactive";
};

export type StaticDepartment = StaticCategory;
export type StaticLocation = StaticCategory;

export type StaticCustodian = {
  id: string;
  firstName: string;
  lastName: string;
};

export type StaticRegistrationIdentifiers = {
  assetTag: string;
  propertyNumber: string;
  qrValue: string;
};


export const registrationInitialValues: RegistrationFormValues = {
  name: "SAMSUNG MONITOR 24″",
  categoryId: "1",
  assetType: "ICT Equipment",
  brand: "Samsung",
  model: "S24C310",
  description: "24-inch LED Monitor",
  condition: "new",
  acquisitionDate: "2026-08-12",
  acquisitionCost: "12500",
  quantity: "1",
  depreciationMethod: "straight-line",
};