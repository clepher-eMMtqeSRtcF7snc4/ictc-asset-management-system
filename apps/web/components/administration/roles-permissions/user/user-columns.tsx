"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./user-actions";

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: number | null;
  department: { id: number; name: string } | null;
  status: "active" | "inactive";
  roles: Array<{
    id: string;
    code: string;
    name: string;
  }>;
}

export function userColumns(
  onEdit: (user: User) => void,
  onDelete: (user: User) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        const dept = row.original.department;
        if (!dept) return <span className="text-muted-foreground">—</span>;
        return <span className="text-sm">{dept.name}</span>;
      },
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => {
        const roles = row.original.roles;
        if (!roles || roles.length === 0) return "—";
        if (roles.length === 1 && roles[0]) {
          return <Badge variant="secondary">{roles[0].name}</Badge>;
        }
        return (
          <div className="flex gap-1 flex-wrap">
            {roles.slice(0, 2).map((role) => (
              <Badge key={role.id} variant="secondary" className="text-xs">
                {role.name}
              </Badge>
            ))}
            {roles.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{roles.length - 2}
              </Badge>
            )}
          </div>
        );
      },
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
        <UserActions
          user={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
