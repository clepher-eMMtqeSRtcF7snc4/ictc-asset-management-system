import { z } from "zod";

export const roomFormSchema = z.object({
  code: z.string().min(1, "Room code is required"),
  name: z.string().min(1, "Room name is required"),
  building: z.string().min(1, "Building is required"),
  floor: z.string().min(1, "Floor is required"),
  department: z.string().min(1, "Department is required"),
  roomType: z.string().min(1, "Room type is required"),
  custodian: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;
