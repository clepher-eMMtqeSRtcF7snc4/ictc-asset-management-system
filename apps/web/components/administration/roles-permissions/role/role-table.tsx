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
import { roleColumns } from "./role-columns";
import { Role } from "./role-columns";

interface RoleTableProps {
  data: Role[];
  page: number;
  pageSize: number;
  totalPages: number;
  onPaginationChange: (next: { page: number; pageSize: number }) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleTable({
  data,
  page,
  pageSize,
  totalPages,
  onPaginationChange,
  onEdit,
  onDelete,
}: RoleTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = useMemo(
    () =>
      roleColumns(onEdit, onDelete),
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
                <TableCell colSpan={roleColumns(onEdit, onDelete).length} className="h-36 text-center">
                  <p className="font-medium">No roles found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No roles match your current search.
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
