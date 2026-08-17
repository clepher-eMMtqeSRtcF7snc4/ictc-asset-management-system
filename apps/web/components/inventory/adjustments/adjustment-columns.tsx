"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { AdjustmentRecord } from "../types"

const typeVariant: Record<string, "success" | "destructive"> = {
  INCREASE: "success",
  DECREASE: "destructive",
}

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  DRAFT: "secondary",
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
}

export const adjustmentColumns: ColumnDef<AdjustmentRecord>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Adjustment No.
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.referenceNo}</span>,
  },
  {
    accessorKey: "adjustmentDate",
    header: "Date",
    cell: ({ row }) => <span className="text-xs">{row.original.adjustmentDate}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant={typeVariant[row.original.type]}>{row.original.type}</Badge>,
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => <span className="block max-w-48 truncate text-xs" title={row.original.reason}>{row.original.reason}</span>,
  },
  {
    accessorKey: "adjustedBy",
    header: "Performed By",
    cell: ({ row }) => <span className="text-xs">{row.original.adjustedBy}</span>,
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

function RowActions({ record }: { record: AdjustmentRecord }) {
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
