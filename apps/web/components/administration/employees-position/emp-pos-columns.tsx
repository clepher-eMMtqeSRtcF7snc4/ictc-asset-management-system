"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Employee } from "@repo/trpc/schemas";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EmployeeRow = Employee & {
  departmentCode: string;
  departmentColor: string | null;
};

export const employeeColumns: ColumnDef<EmployeeRow>[] = [
  { accessorKey: "firstName", header: "First Name", cell: ({ row }) => <span className="font-medium">{row.original.firstName}</span> },
  { accessorKey: "lastName", header: "Last Name", cell: ({ row }) => row.original.lastName },
  { accessorKey: "email", header: "Email", cell: ({ row }) => row.original.email },
  { accessorKey: "position", header: "Position", cell: ({ row }) => row.original.position },
  { accessorKey: "designation", header: "Designation", cell: ({ row }) => row.original.designation },
  {
    accessorKey: "departmentId",
    header: "Department",
    cell: ({ row }) => {
      const color = row.original.departmentColor;
      const code = row.original.departmentCode ?? "—";
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
            color ? "" : "bg-primary/10 text-primary"
          )}
          style={color ? { backgroundColor: `${color}20`, color } : undefined}
        >
          {code}
        </span>
      );
    },
  },
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
