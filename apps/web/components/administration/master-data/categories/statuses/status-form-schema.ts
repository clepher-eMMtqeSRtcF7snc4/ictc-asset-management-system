import { z } from "zod";

export const statusFormSchema = z.object({
  code: z.string().min(1, "Status code is required"),
  name: z.string().min(1, "Status name is required"),
  description: z.string().optional(),
  statusType: z.string().min(1, "Status type is required"),
  status: z.enum(["active", "inactive"]),
});

export type StatusFormValues = z.infer<typeof statusFormSchema>;
