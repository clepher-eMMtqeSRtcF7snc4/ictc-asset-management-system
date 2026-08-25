"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Department } from "@repo/trpc/schemas";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/image";
import Image from "next/image";

export const departmentColumns: ColumnDef<Department>[] = [
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) =>
      row.original.logo ? (
        <Image src={getImageUrl(row.original.logo)} alt={row.original.name} width={32} height={32} unoptimized className="size-8 rounded object-cover" />
      ) : (
        "—"
      ),
  },
  { accessorKey: "code", header: "Code", cell: ({ row }) => <span className="font-mono text-xs">{row.original.code}</span> },
  { accessorKey: "name", header: "Department Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) =>
      row.original.color ? (
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-full" style={{ backgroundColor: row.original.color }} />
          {row.original.color}
        </span>
      ) : (
        "—"
      ),
  },
  { accessorKey: "description", header: "Description", cell: ({ row }) => row.original.description || "—" },
  { accessorKey: "supervisor", header: "Department Head", cell: ({ row }) => row.original.supervisor || "—" },
  { accessorKey: "custodian", header: "Custodian", cell: ({ row }) => row.original.custodian || "—" },
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