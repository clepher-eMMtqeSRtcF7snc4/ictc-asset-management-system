import { z } from "zod";

export const departmentFormSchema = z.object({
  code: z.string().min(1, "Department code is required"),
  name: z.string().min(1, "Department name is required"),
  shortName: z.string().optional(),
  head: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  description: z.string().optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
