"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Employee } from "@repo/trpc/schemas";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getImageUrl } from "@/lib/image";

type EmployeeRow = Employee & {
  departmentCode: string;
  departmentColor: string | null;
};

export const employeeColumns: ColumnDef<EmployeeRow>[] = [
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => {
      const photo = row.original.photo;
      return (
        <div className="flex items-center gap-2">
          {photo ? (
            <Image
              src={getImageUrl(photo)}
              unoptimized
              alt={`${row.original.firstName} ${row.original.lastName}`}
              width={32}
              height={32}
              className="size-8 rounded-full border object-cover"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-muted-foreground">
              {row.original.lastName.slice(0, 1)}
            </div>
          )}
          <span className="font-medium">{row.original.lastName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => row.original.firstName,
  },
  { accessorKey: "email", header: "Email", cell: ({ row }) => row.original.email },
  { accessorKey: "position", header: "Position", cell: ({ row }) => row.original.position || "—" },
  { accessorKey: "designation", header: "Designation", cell: ({ row }) => row.original.designation || "—" },
  {
    accessorKey: "departmentCode",
    header: "Department",
    cell: ({ row }) => {
      const color = row.original.departmentColor;
      const code = row.original.departmentCode ?? "—";
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
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
    cell: ({ row }) => {
      const statusMap: Record<string, string> = {
        active: "Active",
        inactive: "Inactive",
        retire: "Retire",
      };
      return (
        <Badge variant={row.original.status === "active" ? "success" : "destructive"}>
          {statusMap[row.original.status] || row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
  },
];
