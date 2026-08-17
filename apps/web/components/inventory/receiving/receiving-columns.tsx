"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ReceivingRecord } from "../types"

const statusVariant: Record<string, "success" | "warning" | "info" | "destructive" | "secondary"> = {
  DRAFT: "secondary",
  RECEIVED: "info",
  INSPECTED: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
}

export const receivingColumns: ColumnDef<ReceivingRecord>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Receiving No.
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.referenceNo}</span>,
  },
  {
    accessorKey: "receivedDate",
    header: "Date",
    cell: ({ row }) => <span className="text-xs">{row.original.receivedDate}</span>,
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: ({ row }) => <span className="block max-w-36 truncate text-xs" title={row.original.supplier}>{row.original.supplier}</span>,
  },
  {
    accessorKey: "totalItems",
    header: "Items",
    cell: ({ row }) => <span className="tabular-nums">{row.original.totalItems}</span>,
  },
  {
    accessorKey: "totalCost",
    header: "Total Cost",
    cell: ({ row }) => (
      <span className="tabular-nums">₱{row.original.totalCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
    ),
  },
  {
    accessorKey: "receivedBy",
    header: "Received By",
    cell: ({ row }) => <span className="text-xs">{row.original.receivedBy}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <Badge variant={statusVariant[row.original.status] ?? "secondary"}>{row.original.status}</Badge>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions record={row.original} />,
    enableHiding: false,
  },
]

function RowActions({ record }: { record: ReceivingRecord }) {
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
        <DropdownMenuItem className="text-destructive"><Trash2 /> Void</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
