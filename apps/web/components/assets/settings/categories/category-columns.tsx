"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { SettingsAssetCategory } from "@repo/trpc/schemas";
import { Badge } from "@/components/ui/badge";

export const categoryColumns: ColumnDef<SettingsAssetCategory>[] = [
  { accessorKey: "name", header: "Category", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "description", header: "Description", cell: ({ row }) => row.original.description || <span className="text-muted-foreground">—</span> },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "success" : "destructive"}>
        {row.original.status === "active" ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
  },
];
