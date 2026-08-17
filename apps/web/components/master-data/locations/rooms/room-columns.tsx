"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import type { Room } from "@/components/master-data/types";

export const roomColumns: ColumnDef<Room>[] = [
  { accessorKey: "code", header: "Room Code", cell: ({ row }) => <span className="font-mono text-xs">{row.original.code}</span> },
  { accessorKey: "name", header: "Room Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "building", header: "Building" },
  { accessorKey: "floor", header: "Floor" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "roomType", header: "Room Type" },
  { accessorKey: "custodian", header: "Assigned Custodian", cell: ({ row }) => row.original.custodian || "—" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${row.original.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
        {row.original.status === "active" ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions room={row.original} />,
  },
];

function RowActions({ room }: { room: Room }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${room.name}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye /> View
        </DropdownMenuItem>
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
