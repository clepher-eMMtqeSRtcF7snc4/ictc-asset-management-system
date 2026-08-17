"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, PackagePlus, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ReorderItem } from "../types"

const priorityVariant: Record<string, "success" | "warning" | "destructive"> = {
  HIGH: "destructive",
  MEDIUM: "warning",
  LOW: "success",
}

export const reorderColumns: ColumnDef<ReorderItem>[] = [
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Item Code
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.sku}</span>,
  },
  {
    accessorKey: "name",
    header: "Item Name",
    cell: ({ row }) => <span className="block max-w-48 truncate font-medium" title={row.original.name}>{row.original.name}</span>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span className="text-xs">{row.original.category}</span>,
  },
  {
    accessorKey: "currentStock",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Current Stock
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <span className="tabular-nums">{row.original.currentStock}</span>,
  },
  {
    accessorKey: "minStock",
    header: "Min Stock",
    cell: ({ row }) => <span className="tabular-nums">{row.original.minStock}</span>,
  },
  {
    accessorKey: "reorderQty",
    header: "Reorder Qty",
    cell: ({ row }) => <span className="tabular-nums">{row.original.reorderQty}</span>,
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: ({ row }) => <span className="block max-w-36 truncate text-xs" title={row.original.supplier}>{row.original.supplier}</span>,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Priority
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <Badge variant={priorityVariant[row.original.priority]}>{row.original.priority}</Badge>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions item={row.original} />,
    enableHiding: false,
  },
]

function RowActions({ item }: { item: ReorderItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${item.name}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/inventory/${item.itemId}`}><Eye /> View Item</Link>
        </DropdownMenuItem>
        <DropdownMenuItem><PackagePlus /> Create Purchase Request</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive"><X /> Dismiss</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
