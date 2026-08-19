import { z } from "zod";

export const buildingStatusSchema = z.enum(["active", "inactive"]);

const buildingFieldsSchema = z.object({
  name: z.string().trim().min(1, "This field is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
    status: buildingStatusSchema,
  description: z.string().trim().max(500).optional().nullable(),
});

export const buildingIdSchema = z.object({
  buildingId: z.string()
});

export const getBuildingByIdInputSchema = z.object({
  id: z.number().int().positive(),
});

export const buildingSchema = buildingFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const officeSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    room: z.string(),
    logo: z.string(),
    officeHead: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      avatar: z.string() 
    }),
    custodian: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      avatar: z.string()
    })
  });

export const locationListInputSchema = z
  .object({
    search: z.string().trim().min(1).max(100).optional(),
    status: buildingStatusSchema.optional(),
    type: z.string().trim().min(1).max(100).optional(),
  })
  .default({});

export const buildingListInputSchema = z
  .object({
    search: z.string().trim().optional(),
    status: buildingStatusSchema.optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  })
  .default({});

export const buildingListOutputSchema = z.object({
  items: z.array(buildingSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export const createBuildingInputSchema = buildingFieldsSchema;

export const updateBuildingInputSchema = buildingFieldsSchema
  .partial()
  .extend({
    id: z.number().int().positive(),
  })
  .refine(
    ({ name, code, description }) =>
      name !== undefined ||
      code !== undefined ||
      description !== undefined ||
    { message: "Provide at least one field to update" },
  );

export const setBuildingStatusInputSchema = z.object({
  id: z.number().int().positive(),
  status: buildingStatusSchema,
});

export type Location = z.infer<typeof buildingSchema>;
export type LocationListInput = z.infer<typeof locationListInputSchema>;
export type UpdateBuildingInput = z.infer<typeof updateBuildingInputSchema>;
export type SetBuildingStatusInput = z.infer<
typeof setBuildingStatusInputSchema
>;

export type CreateBuildingInput = z.infer<typeof buildingFieldsSchema>;
export type GetBuildingInput = z.infer<typeof buildingIdSchema>;
export type GetBuildingByIdInput = z.infer<typeof getBuildingByIdInputSchema>;
export type Building = z.infer<typeof buildingSchema>;
export type BuildingListInput = z.infer<typeof buildingListInputSchema>;
export type BuildingListOutput = z.infer<typeof buildingListOutputSchema>;
