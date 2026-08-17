"use client"

import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { Download, PackagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/ui/datatable-pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { inventoryItemColumns } from "./inventory-item-columns"
import type { InventoryItem } from "../types"

export function InventoryItemsTable({ data, showColumns, columns }: { data: InventoryItem[]; showColumns: boolean; columns?: ColumnDef<InventoryItem>[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns: columns ?? inventoryItemColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, rowSelection, columnVisibility },
    initialState: { pagination: { pageSize: 10 } },
  })

  const selected = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="rounded-lg border">
      <div className="flex min-h-14 items-center justify-between gap-3 border-b px-4">
        <p className="text-sm font-semibold">
          Inventory Items{" "}
          <span className="ml-1 text-xs font-normal text-muted-foreground">(Showing {data.length})</span>
        </p>
        {selected > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <strong>{selected} selected</strong>
            <Button size="xs" variant="outline">
              <Download /> Export
            </Button>
            <Button size="xs" variant="outline">
              <PackagePlus /> Stock In
            </Button>
          </div>
        )}
      </div>

      {showColumns && (
        <div className="flex flex-wrap gap-2 border-b bg-muted/30 p-3">
          {table.getAllLeafColumns().filter((column) => column.getCanHide()).map((column) => (
            <label key={column.id} className="flex items-center gap-1.5 text-xs">
              <input
                className="accent-primary"
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={(event) => column.toggleVisibility(event.target.checked)}
              />
              {column.id === "unitCost" ? "Unit Cost" : column.id === "minStock" ? "Min Stock" : column.id === "lastUpdated" ? "Last Updated" : column.id.replace(/([A-Z])/g, " $1")}
            </label>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap text-[11px]">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={(columns ?? inventoryItemColumns).length} className="h-36 text-center">
                  <p className="font-medium">No items found</p>
                  <p className="mt-1 text-sm text-muted-foreground">No items match your current search and filters.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="border-t py-3">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
