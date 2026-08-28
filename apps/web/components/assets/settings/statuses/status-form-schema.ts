import { z } from "zod";

export const statusFormSchema = z.object({
  name: z.string().trim().min(1, "Status name is required").max(150),
  code: z
    .string()
    .trim()
    .min(1, "Status code is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
  description: z.string().trim().max(500).optional().nullable().default(null),
  status: z.enum(["active", "inactive"]),
});

export type StatusFormValues = z.infer<typeof statusFormSchema>;