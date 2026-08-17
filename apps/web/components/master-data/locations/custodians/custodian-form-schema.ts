import { z } from "zod";

export const custodianFormSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  office: z.string().min(1, "Office is required"),
  status: z.enum(["active", "inactive"]),
});

export type CustodianFormValues = z.infer<typeof custodianFormSchema>;
