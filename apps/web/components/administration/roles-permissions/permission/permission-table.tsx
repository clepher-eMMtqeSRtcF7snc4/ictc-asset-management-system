"use client";

import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, type PaginationState, type SortingState, useReactTable, type VisibilityState } from "@tanstack/react-table";
import { DataTablePagination } from "@/components/ui/datatable-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { permissionColumns } from "./permission-columns";
import { Permission } from "./permission-columns";

interface PermissionTableProps {
  data: Permission[];
  page: number;
  pageSize: number;
  totalPages: number;
  onPaginationChange: (next: { page: number; pageSize: number }) => void;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
}

export function PermissionTable({
  data,
  page,
  pageSize,
  totalPages,
  onPaginationChange,
  onEdit,
  onDelete,
}: PermissionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = useMemo(
    () => permissionColumns(onEdit, onDelete),
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnVisibility,
      pagination: { pageIndex: page - 1, pageSize },
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const next: PaginationState =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize })
          : updater;
      onPaginationChange({ page: next.pageIndex + 1, pageSize: next.pageSize });
    },
  });

  return (
    <div className="rounded-lg pb-3">
      <div className="overflow-x-auto mb-3">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={permissionColumns(onEdit, onDelete).length} className="h-36 text-center">
                  <p className="font-medium">No permissions found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No permissions match your current search.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
