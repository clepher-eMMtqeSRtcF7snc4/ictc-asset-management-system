"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { SettingsAssetType } from "@repo/trpc/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface AssetTypeColumnParams {
  onEdit: (assetType: SettingsAssetType) => void;
  onDelete: (assetType: SettingsAssetType) => void;
  categoryMap: Map<number, string>;
}

export function getAssetTypeColumns(params: AssetTypeColumnParams): ColumnDef<SettingsAssetType>[] {
  const { onEdit, onDelete, categoryMap } = params;

  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <span className="font-mono text-xs text-primary">{row.original.code}</span>,
    },
    {
      accessorKey: "name",
      header: "Type",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "assetCategoryId",
      header: "Category",
      cell: ({ row }) => {
        const categoryName = categoryMap.get(row.original.assetCategoryId);
        return <span className="font-medium">{categoryName ?? "—"}</span>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description || <span className="text-muted-foreground">—</span>,
    },
    {
      accessorKey: "depreciable",
      header: "Depreciable",
      cell: ({ row }) => row.original.depreciable ? 
      <Badge variant="warning"> Yes </Badge> : 
      <Badge variant="info"> No </Badge>,
    },
    {
      accessorKey: "defaultUsefulLife",
      header: "Useful Life",
      cell: ({ row }) => row.original.defaultUsefulLife ? 
      <Badge variant="default"> {row.original.defaultUsefulLife} years </Badge> : 
      <span className="text-muted-foreground">—</span>,
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
}