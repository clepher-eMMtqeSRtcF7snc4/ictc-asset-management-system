"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { RoleActions } from "./role-actions";

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export function roleColumns(onEdit: (role: Role) => void, onDelete: (role: Role) => void): ColumnDef<Role>[] {
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "active" ? "success" : "info"}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RoleActions
          role={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
