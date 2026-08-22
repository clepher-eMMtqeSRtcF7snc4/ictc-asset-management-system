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

export const getBuildingByIdInputSchema = z.object({
  id: z.number().int().positive(),
});

export const buildingSchema = buildingFieldsSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

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

export const deleteBuildingInputSchema = z.object({
  id: z.number().int().positive(),
});

export const createBuildingInputSchema = buildingFieldsSchema;


export type Building = z.infer<typeof buildingSchema>;
export type BuildingListInput = z.infer<typeof buildingListInputSchema>;
export type BuildingListOutput = z.infer<typeof buildingListOutputSchema>;
export type CreateBuildingInput = z.infer<typeof buildingFieldsSchema>;
export type GetBuildingByIdInput = z.infer<typeof getBuildingByIdInputSchema>;
export type UpdateBuildingInput = z.infer<typeof updateBuildingInputSchema>;
export type DeleteBuildingInput = z.infer<typeof deleteBuildingInputSchema>;

export const roomTypeInput = z.object({
  code: z.string().optional().nullable(),
  name: z.string().min(1, "This field is required")
});

export const roomTypeSchema = roomTypeInput.extend({
  id: z.number().int().positive()
});

export const updateRoomTypeInput = roomTypeInput
  .partial()
  .extend({
     id: z.number().int().positive()
  })
  .refine(({code, name}) => 
    name !== undefined ||
    code !== undefined || 
    {message: "Provide at least one field to update"}
  );

export const deleteRoomType = z.object({
  id: z.number().int().positive(),
});


export type RoomType = z.infer<typeof roomTypeSchema>
export type CreateRoomTypeInput = z.infer<typeof roomTypeInput>
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeInput>
export type DeleteRoomTypeInput = z.infer<typeof deleteRoomType>


export const roomFloorSchema = z.enum(["1st floor", "2nd floor", "3rd floor", "4th floor"]);
export const roomStatusSchema = z.enum(["active", "inactive"]);

export const roomFieldSchema = z.object({
  name: z.string(),
  code: z.string().optional().nullable(),
  roomTypeId: z.number().int().positive(),
  buildingId: z.number().int().positive(),
  floor: roomFloorSchema,
  departmentId: z.number().int().positive().nullable(),
});

export const roomSchema = roomFieldSchema.extend({
  id: z.number().int().positive(),
  status: roomStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CreateRoomInput = z.infer<typeof roomFieldSchema>;
