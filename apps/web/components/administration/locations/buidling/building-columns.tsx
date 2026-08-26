"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Building } from "@repo/trpc/schemas";

interface BuildingColumnsOptions {
  roomCounts?: Record<number, number>;
}

export function buildingColumns({
  roomCounts = {},
}: BuildingColumnsOptions = {}): ColumnDef<Building>[] {
  return [
    { accessorKey: "code", header: "Short Code", cell: ({ row }) => <span className="font-mono text-xs">{row.original.code}</span> },
    { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "description", header: "Description", cell: ({ row }) => row.original.description || "—" },
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
      accessorKey: "roomCount",
      header: "Total Rooms",
      cell: ({ row }) => {
        const count = roomCounts[row.original.id] ?? 0;
        return (
          <Badge variant={count > 0 ? "default" : "secondary"} className="cursor-default">
            {count}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
    },
  ];
}
