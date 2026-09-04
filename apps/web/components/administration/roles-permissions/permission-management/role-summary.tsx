"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from "lucide-react";

interface RoleSummaryProps {
  role?: {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    status: "active" | "inactive";
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  roleLoading?: boolean;
  assignedCount: number;
  totalPermissions: number;
  assignedTotal: number;
}

function formatDate(date: Date | string | undefined) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function RoleSummary({
  role,
  roleLoading,
  assignedCount,
  totalPermissions,
  assignedTotal,
}: RoleSummaryProps) {
  if (roleLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100/50">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold">{role.name}</p>
            <p className="text-sm text-muted-foreground">
              {role.description || "No description"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={role.status === "active" ? "success" : "info"}
            className="capitalize"
          >
            {role.status}
          </Badge>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:divide-x">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase">
            Role ID
          </p>
          <p className="text-sm">{role.id || role.code}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase">
            Code
          </p>
          <p className="text-sm font-mono">{role.code}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase">
            Date Created
          </p>
          <p className="text-sm">{formatDate(role.createdAt)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase">
            Last Updated
          </p>
          <p className="text-sm">{formatDate(role.updatedAt)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase">
            Assigned Permissions
          </p>
          <p className="text-sm">
            {assignedTotal} of {totalPermissions}
          </p>
        </div>
      </div>
    </>
  );
}
