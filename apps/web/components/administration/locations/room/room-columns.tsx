"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Room } from "@repo/trpc/schemas";

export const roomColumn: ColumnDef<Room>[] = [
  { accessorKey: "code", header: "Room Code", cell: ({ row }) => <span className="font-mono text-xs">{row.original.code || "—"}</span> },
  { accessorKey: "name", header: "Room Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "floor", header: "Floor", cell: ({ row }) => <span>{row.original.floor}</span> },
  {
    accessorKey: "roomTypeId",
    header: "Room Type",
    cell: ({ row }) => {
      const types: Record<number, string> = { 1: "Conference", 2: "Office", 3: "Storage", 4: "Executive", 5: "Training", 6: "Server", 7: "Pantry" };
      return <span>{types[row.original.roomTypeId] || "Unknown"}</span>;
    },
  },
  {
    accessorKey: "departmentId",
    header: "Department",
    cell: ({ row }) => {
      const departments: Record<number, string> = { 1: "Administration", 2: "IT", 3: "HR", 4: "Finance", 5: "Executive" };
      return <span>{row.original.departmentId ? departments[row.original.departmentId] || "—" : "—"}</span>;
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
