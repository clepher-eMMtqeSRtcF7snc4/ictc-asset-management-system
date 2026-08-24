"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Designation } from "@repo/trpc/schemas";

export const designationColumns: ColumnDef<Designation>[] = [
  { accessorKey: "name", header: "Designation" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
          row.original.status === "active"
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
        }`}
      >
        {row.original.status === "active" ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    accessorKey: "employeeCount",
    header: "Employees",
    cell: ({ row }) => row.original.employeeCount,
  },
  {
    id: "actions",
    header: "Actions",
  },
];
