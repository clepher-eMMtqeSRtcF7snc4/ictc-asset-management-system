import z from "zod";

export const supplierStatusSchema = z.enum(["active", "inactive"]);

export const supplierFiledSchema = z.object({
    name: z.string().trim().min(1, "This field is required").max(255),
    code: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(50)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, hyphens, or underscores"),
    businessRegistrationNo: z.string().trim().optional().nullable(),
    philGEPsNo: z.string().trim().optional().nullable(),
    TIN: z.string().trim().optional().nullable(),
    VAT: z.boolean().default(false),
    description: z.string().trim().max(500).optional().nullable(),
    status: supplierStatusSchema,
})