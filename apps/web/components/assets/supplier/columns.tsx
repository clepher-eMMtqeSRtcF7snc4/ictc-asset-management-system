"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "@repo/trpc/schemas";
import { Badge } from "@/components/ui/badge";

export const supplierColumns: ColumnDef<Supplier>[] = [
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
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  
  {
    accessorKey: "businessRegistrationNo",
    header: "Business Reg No",
  },
  {
    accessorKey: "philGEPsNo",
    header: "PhilGEPS No",
  },
  {
    accessorKey: "TIN",
    header: "TIN",
  },
  {
    accessorKey: "VAT",
    header: "VAT",
    cell: ({ row }) => (
      <Badge
        variant={row.original.VAT ? 'success' : 'warning'}
      >
        {row.original.VAT ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === 'active' ? 'success' : 'destructive'}
      >
        {row.original.status === 'active' ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
  },
];
