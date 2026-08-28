"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AssetCondition } from "@repo/trpc/schemas";
import { Badge } from "@/components/ui/badge";

export const conditionColumns: ColumnDef<AssetCondition>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-primary">
        {row.original.code}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Condition",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "success" : "destructive"}
      >
        {row.original.status === "active" ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
  },
];
