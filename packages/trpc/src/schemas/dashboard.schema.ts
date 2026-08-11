import z from "zod";

export const dashBoardStatsSchema = z.object({
  label: z.string(),
  value: z.string(),
  change: z.string(),
  icon: z.string(),
  color: z.string(),
  bg: z.string(),
});

export const dashboardRecentActivitySchema = z.object({
  action: z.string(),
  detail: z.string(),
  time: z.string(),
  type: z.string(),
});

export const dashboardAssetsByStatusSchema = z.object({
  label: z.string(),
  count: z.number(),
  total: z.number(),
  color: z.string(),
});

export const dashboardPendingApprovalsSchema = z.object({
  id: z.string(),
  type: z.string(),
  dept: z.string(),
  amount: z.string(),
  step: z.string(),
  urgent: z.boolean(),
});


export type DashBoardStats = z.infer<typeof dashBoardStatsSchema>;
export type DashboardRecentActivity = z.infer<typeof dashboardRecentActivitySchema>;
export type DashboardAssetsByStatus = z.infer<typeof dashboardAssetsByStatusSchema>;
export type DashboardPendingApprovals = z.infer<typeof dashboardPendingApprovalsSchema>
