import z from "zod";

export const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  shortCode: z.string(),
  building: z.string().optional(),
  room: z.string().optional(),
  floor: z.string().optional()
});

export type Departments = z.infer<typeof departmentSchema>