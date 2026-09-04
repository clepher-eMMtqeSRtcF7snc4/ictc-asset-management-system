"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { PermissionActions } from "./permission-actions";

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  module: string;
  action: string;
}

export function permissionColumns(onEdit: (permission: Permission) => void, onDelete: (permission: Permission) => void): ColumnDef<Permission>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.code}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description || "—",
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }) => (
        <Badge variant="info">{row.original.module}</Badge>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => row.original.action,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <PermissionActions
          permission={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
