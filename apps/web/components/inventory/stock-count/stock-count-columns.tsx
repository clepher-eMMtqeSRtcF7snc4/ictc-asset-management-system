"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { StockCountRecord } from "../types"

const statusVariant: Record<string, "success" | "warning" | "info" | "secondary"> = {
  DRAFT: "secondary",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  ADJUSTED: "warning",
}

export const stockCountColumns: ColumnDef<StockCountRecord>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Count No.
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.referenceNo}</span>,
  },
  {
    accessorKey: "countDate",
    header: "Date",
    cell: ({ row }) => <span className="text-xs">{row.original.countDate}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-xs">{row.original.location}</span>,
  },
  {
    accessorKey: "totalItems",
    header: "Items",
    cell: ({ row }) => <span className="tabular-nums">{row.original.totalItems}</span>,
  },
  {
    accessorKey: "variances",
    header: "Discrepancies",
    cell: ({ row }) => (
      <span className={`tabular-nums ${row.original.variances > 0 ? "text-amber-600" : "text-emerald-600"}`}>
        {row.original.variances}
      </span>
    ),
  },
  {
    accessorKey: "countedBy",
    header: "Performed By",
    cell: ({ row }) => <span className="text-xs">{row.original.countedBy}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <Badge variant={statusVariant[row.original.status] ?? "secondary"}>{row.original.status.replace("_", " ")}</Badge>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions record={row.original} />,
    enableHiding: false,
  },
]

function RowActions({ record }: { record: StockCountRecord }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${record.referenceNo}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/inventory/${record.id}`}><Eye /> View Details</Link>
        </DropdownMenuItem>
        <DropdownMenuItem><Pencil /> Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive"><Trash2 /> Cancel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
