"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Printer } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AssetConditionBadge } from "./asset-condition-badge"
import { AssetStatusBadge } from "./asset-status-badge"
import type { AssetListItem } from "./types"

function SortHeader({ title, column }: { title: string; column: { toggleSorting: (descending: boolean) => void; getIsSorted: () => false | "asc" | "desc" } }) {
  return <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>{title}<ArrowUpDown /></Button>
}

export const assetListColumns: ColumnDef<AssetListItem>[] = [
  { id: "select", header: ({ table }) => <input aria-label="Select all assets on page" type="checkbox" checked={table.getIsAllPageRowsSelected()} onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)} />, cell: ({ row }) => <input aria-label={`Select ${row.original.name}`} type="checkbox" checked={row.getIsSelected()} onChange={(event) => row.toggleSelected(event.target.checked)} />, enableSorting: false, enableHiding: false },
  { accessorKey: "assetTag", header: ({ column }) => <SortHeader title="Asset Tag" column={column} />, cell: ({ row }) => <Link className="font-mono text-xs font-semibold text-primary hover:underline" href={`/assets/${row.original.id}`}>{row.original.assetTag}</Link>, enableHiding: false },
  { accessorKey: "propertyNumber", header: ({ column }) => <SortHeader title="Property No." column={column} />, cell: ({ row }) => <span className="font-mono text-xs">{row.original.propertyNumber}</span> },
  { accessorKey: "name", header: ({ column }) => <SortHeader title="Asset Name" column={column} />, cell: ({ row }) => <span className="block max-w-40 truncate font-medium" title={row.original.name}>{row.original.name}</span>, enableHiding: false },
  { accessorKey: "category", header: ({ column }) => <SortHeader title="Category" column={column} />, cell: ({ row }) => <span className="rounded-full bg-muted px-2 py-1 text-xs">{row.original.category}</span> },
  { accessorKey: "brandModel", header: "Brand / Model", cell: ({ row }) => <span className="block max-w-32 truncate text-xs" title={row.original.brandModel}>{row.original.brandModel}</span> },
  { accessorKey: "serialNumber", header: "Serial Number", cell: ({ row }) => <span className="font-mono text-xs">{row.original.serialNumber}</span> },
  { accessorKey: "custodian", header: ({ column }) => <SortHeader title="Assigned To" column={column} />, cell: ({ row }) => row.original.custodian },
  { accessorKey: "department", header: ({ column }) => <SortHeader title="Department" column={column} /> },
  { accessorKey: "location", header: "Location", cell: ({ row }) => <span className="block max-w-36 truncate" title={row.original.location}>{row.original.location}</span> },
  { accessorKey: "status", header: ({ column }) => <SortHeader title="Status" column={column} />, cell: ({ row }) => <AssetStatusBadge status={row.original.status} />, enableHiding: false },
  { accessorKey: "condition", header: ({ column }) => <SortHeader title="Condition" column={column} />, cell: ({ row }) => <AssetConditionBadge condition={row.original.condition} /> },
  { accessorKey: "acquisitionDate", header: ({ column }) => <SortHeader title="Acq. Date" column={column} /> },
  { id: "actions", header: "Actions", cell: ({ row }) => <RowActions asset={row.original} />, enableHiding: false },
]

function RowActions({ asset }: { asset: AssetListItem }) {
  const disposed = asset.status === "DISPOSED"
  return <DropdownMenu><DropdownMenuTrigger asChild><Button size="icon-xs" variant="ghost" aria-label={`Actions for ${asset.name}`}><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link href={`/assets/${asset.id}`}><Eye /> View</Link></DropdownMenuItem>{!disposed && <DropdownMenuItem><Pencil /> Edit</DropdownMenuItem>}{!disposed && <DropdownMenuItem>Assign</DropdownMenuItem>}{!disposed && <DropdownMenuItem>Transfer</DropdownMenuItem>}{!disposed && <DropdownMenuItem>Maintenance</DropdownMenuItem>}<DropdownMenuSeparator /><DropdownMenuItem>View History</DropdownMenuItem>{disposed && <DropdownMenuItem>View Disposal</DropdownMenuItem>}<DropdownMenuItem><Printer /> Print</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
}
