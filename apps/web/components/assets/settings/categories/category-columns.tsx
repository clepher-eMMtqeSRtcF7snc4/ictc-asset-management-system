"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import type { Category } from "@repo/trpc/schemas"; 
import { Badge } from "@/components/ui/badge";

export const categoryColumns: ColumnDef<Category>[] = [
  { accessorKey: "code", header: "Code", cell: ({ row }) => <span className="font-mono text-xs">{row.original.code}</span> },
  { accessorKey: "name", header: "Category", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  { accessorKey: "description", header: "Description" },
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
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${row.original.name}`}>
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
    ),
  },
];
