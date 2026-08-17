import { z } from "zod";

export const categoryFormSchema = z.object({
  code: z.string().min(1, "Category code is required"),
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Asset type is required"),
  depreciable: z.boolean(),
  defaultUsefulLife: z.number().int().positive().optional().nullable(),
  status: z.enum(["active", "inactive"]),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
