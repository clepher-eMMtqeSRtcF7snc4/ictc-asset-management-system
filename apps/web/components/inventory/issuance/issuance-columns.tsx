"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { IssuanceRecord } from "../types"

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  DRAFT: "secondary",
  ISSUED: "success",
  APPROVED: "success",
  CANCELLED: "destructive",
}

export const issuanceColumns: ColumnDef<IssuanceRecord>[] = [
  {
    accessorKey: "referenceNo",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Issuance No.
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.original.referenceNo}</span>,
  },
  {
    accessorKey: "issuedDate",
    header: "Date",
    cell: ({ row }) => <span className="text-xs">{row.original.issuedDate}</span>,
  },
  {
    accessorKey: "requester",
    header: "Requestor",
    cell: ({ row }) => <span className="text-xs">{row.original.requester}</span>,
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <span className="text-xs">{row.original.department}</span>,
  },
  {
    accessorKey: "totalItems",
    header: "Quantity",
    cell: ({ row }) => <span className="tabular-nums">{row.original.totalItems}</span>,
  },
  {
    accessorKey: "issuedBy",
    header: "Issued By",
    cell: ({ row }) => <span className="text-xs">{row.original.issuedBy}</span>,
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

function RowActions({ record }: { record: IssuanceRecord }) {
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
