import { z } from "zod";

export const conditionFormSchema = z.object({
  code: z.string().min(1, "Condition code is required"),
  name: z.string().min(1, "Condition name is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type ConditionFormValues = z.infer<typeof conditionFormSchema>;
