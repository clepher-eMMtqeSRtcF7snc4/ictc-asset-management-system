"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowDownToLine, ArrowUpDown, Eye, MoreHorizontal, Pencil, PackagePlus, Printer } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { InventoryItem, InventoryItemStatus } from "../types"

const statusVariant: Record<InventoryItemStatus, "success" | "warning" | "destructive"> = {
  IN_STOCK: "success",
  LOW_STOCK: "warning",
  OUT_OF_STOCK: "destructive",
}

const statusLabel: Record<InventoryItemStatus, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
}

function SortHeader({ title, column }: { title: string; column: { toggleSorting: (descending: boolean) => void; getIsSorted: () => false | "asc" | "desc" } }) {
  return (
    <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {title}
      <ArrowUpDown />
    </Button>
  )
}

const baseColumns: ColumnDef<InventoryItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        aria-label="Select all items"
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <input
        aria-label={`Select ${row.original.name}`}
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(event) => row.toggleSelected(event.target.checked)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sku",
    header: ({ column }) => <SortHeader title="SKU" column={column} />,
    cell: ({ row }) => (
      <Link className="font-mono text-xs font-semibold text-primary hover:underline" href={`/inventory/${row.original.id}`}>
        {row.original.sku}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortHeader title="Item Name" column={column} />,
    cell: ({ row }) => (
      <span className="block max-w-48 truncate font-medium" title={row.original.name}>
        {row.original.name}
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span className="rounded-full bg-muted px-2 py-1 text-xs">{row.original.category}</span>,
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => <span className="text-xs">{row.original.unit}</span>,
  },
  {
    accessorKey: "unitCost",
    header: ({ column }) => <SortHeader title="Unit Cost" column={column} />,
    cell: ({ row }) => <span className="tabular-nums">₱{row.original.unitCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <SortHeader title="Stock" column={column} />,
    cell: ({ row }) => (
      <span className="font-semibold tabular-nums">{row.original.quantity.toLocaleString()}</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "minStock",
    header: "Min",
    cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.original.minStock}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="block max-w-36 truncate text-xs" title={row.original.location}>{row.original.location}</span>,
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => <SortHeader title="Supplier" column={column} />,
    cell: ({ row }) => <span className="block max-w-36 truncate text-xs" title={row.original.supplier}>{row.original.supplier}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortHeader title="Status" column={column} />,
    cell: ({ row }) => <Badge variant={statusVariant[row.original.status]}>{statusLabel[row.original.status]}</Badge>,
    enableHiding: false,
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => <SortHeader title="Last Updated" column={column} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions item={row.original} />,
    enableHiding: false,
  },
]

function RowActions({ item, onEdit, onStockIn, onPrint }: { item: InventoryItem; onEdit?: () => void; onStockIn?: () => void; onPrint?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${item.name}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/inventory/${item.id}`}><Eye /> View Details</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}><Pencil /> Edit Item</DropdownMenuItem>
        <DropdownMenuItem onClick={onStockIn}><ArrowDownToLine /> Stock In</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onPrint}><Printer /> Print Label</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function createInventoryItemColumns({
  onEdit,
  onStockIn,
  onPrint,
}: {
  onEdit?: (item: InventoryItem) => void
  onStockIn?: (item: InventoryItem) => void
  onPrint?: (item: InventoryItem) => void
} = {}): ColumnDef<InventoryItem>[] {
  return baseColumns.map((col) => {
    if (col.id !== "actions") return col
    return {
      ...col,
      cell: ({ row }: { row: { original: InventoryItem } }) => (
        <RowActions
          item={row.original}
          onEdit={onEdit ? () => onEdit(row.original) : undefined}
          onStockIn={onStockIn ? () => onStockIn(row.original) : undefined}
          onPrint={onPrint ? () => onPrint(row.original) : undefined}
        />
      ),
    }
  })
}

export const inventoryItemColumns: ColumnDef<InventoryItem>[] = createInventoryItemColumns()
