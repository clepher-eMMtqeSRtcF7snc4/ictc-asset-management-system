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
export type Room = z.infer<typeof roomSchema>;

export const roomListInputSchema = z
  .object({
    buildingId: z.number().int().positive().optional(),
    search: z.string().trim().optional(),
    status: roomStatusSchema.optional(),
    floor: roomFloorSchema.optional(),
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).max(100).optional(),
  })
  .default({});

export const roomListOutputSchema = z.object({
  items: z.array(roomSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export type RoomListInput = z.infer<typeof roomListInputSchema>;
export type RoomListOutput = z.infer<typeof roomListOutputSchema>;

export const DUMMY_ROOMS: Room[] = [
  { id: 1, name: "Conference Room A", code: "CR-A", roomTypeId: 1, buildingId: 1, floor: "1st floor", departmentId: 1, status: "active", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-06-20") },
  { id: 2, name: "Conference Room B", code: "CR-B", roomTypeId: 1, buildingId: 1, floor: "1st floor", departmentId: 1, status: "active", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-06-20") },
  { id: 3, name: "IT Office", code: "IT-01", roomTypeId: 2, buildingId: 1, floor: "2nd floor", departmentId: 2, status: "active", createdAt: new Date("2024-02-01"), updatedAt: new Date("2024-07-10") },
  { id: 4, name: "HR Office", code: "HR-01", roomTypeId: 2, buildingId: 1, floor: "2nd floor", departmentId: 3, status: "active", createdAt: new Date("2024-02-01"), updatedAt: new Date("2024-07-10") },
  { id: 5, name: "Finance Department", code: "FIN-01", roomTypeId: 2, buildingId: 1, floor: "2nd floor", departmentId: 4, status: "active", createdAt: new Date("2024-02-10"), updatedAt: new Date("2024-08-05") },
  { id: 6, name: "Storage Room 1", code: "STR-01", roomTypeId: 3, buildingId: 1, floor: "1st floor", departmentId: null, status: "inactive", createdAt: new Date("2024-03-01"), updatedAt: new Date("2024-05-15") },
  { id: 7, name: "Executive Office", code: "EXE-01", roomTypeId: 4, buildingId: 1, floor: "3rd floor", departmentId: 5, status: "active", createdAt: new Date("2024-01-20"), updatedAt: new Date("2024-09-01") },
  { id: 8, name: "Board Room", code: "BR-01", roomTypeId: 1, buildingId: 1, floor: "3rd floor", departmentId: 5, status: "active", createdAt: new Date("2024-01-20"), updatedAt: new Date("2024-09-01") },
  { id: 9, name: "Training Room", code: "TR-01", roomTypeId: 5, buildingId: 1, floor: "3rd floor", departmentId: 3, status: "active", createdAt: new Date("2024-04-01"), updatedAt: new Date("2024-08-20") },
  { id: 10, name: "Server Room", code: "SRV-01", roomTypeId: 6, buildingId: 1, floor: "4th floor", departmentId: 2, status: "active", createdAt: new Date("2024-01-10"), updatedAt: new Date("2024-09-10") },
  { id: 11, name: "Pantry", code: "PTRY-01", roomTypeId: 7, buildingId: 1, floor: "1st floor", departmentId: null, status: "active", createdAt: new Date("2024-02-15"), updatedAt: new Date("2024-06-30") },
  { id: 12, name: "Pantry", code: "PTRY-02", roomTypeId: 7, buildingId: 1, floor: "2nd floor", departmentId: null, status: "active", createdAt: new Date("2024-02-15"), updatedAt: new Date("2024-06-30") },
  { id: 13, name: "Meeting Room 1", code: "MR-01", roomTypeId: 1, buildingId: 1, floor: "2nd floor", departmentId: 1, status: "active", createdAt: new Date("2024-03-10"), updatedAt: new Date("2024-07-25") },
  { id: 14, name: "Meeting Room 2", code: "MR-02", roomTypeId: 1, buildingId: 1, floor: "2nd floor", departmentId: 4, status: "inactive", createdAt: new Date("2024-03-10"), updatedAt: new Date("2024-07-25") },
  { id: 15, name: "Archives", code: "ARC-01", roomTypeId: 3, buildingId: 1, floor: "4th floor", departmentId: null, status: "active", createdAt: new Date("2024-04-05"), updatedAt: new Date("2024-08-15") },
];

export const DUMMY_ROOM_TYPES: RoomType[] = [
  { id: 1, name: "Conference", code: "CONF" },
  { id: 2, name: "Office", code: "OFF" },
  { id: 3, name: "Storage", code: "STOR" },
  { id: 4, name: "Executive", code: "EXEC" },
  { id: 5, name: "Training", code: "TRAIN" },
  { id: 6, name: "Server", code: "SRV" },
  { id: 7, name: "Pantry", code: "PTRY" },
];
