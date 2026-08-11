import z from "zod";

export const assetsStatsSchema = z.object({
  label: z.string(),
  value: z.string(),
  change: z.string(),
  icon: z.string(),
  color: z.string(),
  bg: z.string(),
});

export const assetsSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  dept: z.string(),
  status: z.enum(["In Stock", "Assigned"]),
  date: z.string()
});

export const assetCategorySchema = z.object({
  id: z.number(),
  label: z.string(),
  value: z.string().nullable(),
});

export const assetTypeSchema = z.object({
  id: z.number(),
  label: z.string(),
  value: z.string().nullable(),
})

export const createAssetsSchema = z.object({
  
  dept: z.string(),
  

  assetId: z.string(),
  assetName: z.string().min(1, "This field is required"),
  category: z.string().min(1, "This field is required"),
  assetType: z.string().min(1, "This field is required"),
  brand: z.string().min(1, "This field is required"),
  model: z.string().min(1, "This field is required"),
  serialNumber: z.string().min(1, "This field is required"),

  serialNumber: z.float32({error: "This field is required"}).positive(),
  acquisitionDate: z.string().min(1, "This field is required"),
  fundSource: z.number({error: "This field is required"}).positive(),
  poNumber: z.string().min(1, "This field is required"),
  invoiceNumber: z.string().min(1, "This field is required"),
  vendor: z.number({error: "This field is required"}).positive(),

  department: z.number({error: "This field is required"}).positive(),
  building: z.number({error: "This field is required"}).positive(),
  floor: z.string().min(1, "This field is required"),
  room: z.string().min(1, "This field is required"),
  custodian: z.string().min(1, "This field is required"),

  warrantyStart: z.string().min(1, "This field is required"),
  warrantyEnd: z.string().min(1, "This field is required"),
  dateCreated: z.string().min(1, "This field is required"),
  status: z.enum(["In Stock", "Assigned"]),
  
  Brand
  Model
  Purchase Cost
  Purchase Date
  Acquisition Date
  Warranty
  Supplier
  Location
  Responsible Unit
  Status
  Condition
})

export type AssetsStats = z.infer<typeof assetsStatsSchema>
export type Assets = z.infer<typeof assetsSchema>
export type AssetCategory = z.infer<typeof assetCategorySchema>
export type AssetType = z.infer<typeof assetTypeSchema>