import z from "zod";

export const fiscalYearSchema = z.object({
  year: z.number().int().min(2015).max(2100),
  status: z.enum(["planning", "implementation", "completed", "archived"]),
  fundSource: z.string().min(2).max(100).optional(),
  budget: z.number().positive().optional(),
  planningStartPeriod: z.string().optional(),
  planningEndPeriod: z.string().optional(),
  implementationStartPeriod: z.string().optional(),
  implementationEndPeriod: z.string().optional(),
  finalSubmission: z.string().optional(),
});

export const createFiscalYearSchema = z.object({
  year: z.number().int().min(2015).max(2100),
  status: z.enum(["planning", "implementation", "completed", "archived"]),
  fundSource: z.string().min(2, "This field is required").max(100),
  budget: z.number({error: "This field is required"}).positive(),
  planningStartPeriod: z.string({error: "This field is required"}).min(1, "This field is required"),
  planningEndPeriod: z.string({error: "This field is required"}).min(1, "This field is required"),
  implementationStartPeriod: z.string({error: "This field is required"}).min(1, "This field is required"),
  implementationEndPeriod: z.string({error: "This field is required"}).min(1, "This field is required"),
  finalSubmission: z.string({error: "This field is required"}).min(1, "This field is required"),
});

export type FiscalYearAction =
  | "update"
  | "delete"
  | "lock"
  | "complete"
  | "archive";

export type FiscalYearInput = z.infer<typeof createFiscalYearSchema>;
export type FiscalYear = z.infer<typeof fiscalYearSchema>;