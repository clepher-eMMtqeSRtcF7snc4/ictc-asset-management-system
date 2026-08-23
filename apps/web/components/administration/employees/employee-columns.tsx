"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Employee } from "@repo/trpc/schemas";

export const employeeColumns: ColumnDef<Employee>[] = [
  { accessorKey: "firstName", header: "First Name", cell: ({ row }) => <span className="font-medium">{row.original.firstName}</span> },
  { accessorKey: "lastName", header: "Last Name", cell: ({ row }) => row.original.lastName },
  { accessorKey: "email", header: "Email", cell: ({ row }) => row.original.email },
  { accessorKey: "position", header: "Position", cell: ({ row }) => row.original.position },
  { accessorKey: "designation", header: "Designation", cell: ({ row }) => row.original.designation },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${row.original.role === "supervisor" ? "bg-primary/10 text-primary" : row.original.role === "custodian" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>
        {row.original.role ? row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${row.original.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
        {row.original.status === "active" ? "Active" : row.original.status === "inactive" ? "Inactive" : "Retired"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions employee={row.original} />,
  },
];

function RowActions({ employee }: { employee: Employee }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${employee.firstName} ${employee.lastName}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
