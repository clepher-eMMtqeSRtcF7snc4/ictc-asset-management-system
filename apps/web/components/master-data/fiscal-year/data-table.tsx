"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Plus, } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/ui/datatable-pagination";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onCreateFiscalYear: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  onCreateFiscalYear,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    
    <div>
      <div className="flex items-center justify-between py-4">
        <div>
          <Input
            placeholder="Filter fiscal years..."
            value={(table.getColumn("year")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("year")?.setFilterValue(event.target.value)
            }
            className="max-w-lg"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          
          <Button 
          onClick={onCreateFiscalYear}
          className="w-full justify-center sm:w-auto" variant="default"
          >
            Create New Fiscal Year
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden p-3">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="pt-3 pb-2">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  )
}