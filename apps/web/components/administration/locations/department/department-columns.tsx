"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Department } from "@repo/trpc/schemas";
import { Badge } from "@/components/ui/badge";

export const departmentColumns: ColumnDef<Department>[] = [
  { accessorKey: "code", header: "Code", cell: ({ row }) => <span className="font-mono text-xs">{row.original.code}</span> },
  { accessorKey: "name", header: "Department Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) =>
      row.original.logo ? (
        <img src={row.original.logo} alt={row.original.name} className="size-8 rounded object-cover" />
      ) : (
        "—"
      ),
  },
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
    cell: ({ row }) => <RowActions department={row.original} />,
  },
];

function RowActions({ department }: { department: Department }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${department.name}`}>
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
