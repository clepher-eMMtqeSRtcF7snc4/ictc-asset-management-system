"use client";

import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getSortedRowModel, type PaginationState, type SortingState, useReactTable, type VisibilityState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/datatable-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { roomColumn } from "./room-columns";
import { Building } from "@repo/trpc/schemas";
import Link from "next/link";

type BuildingRow = Omit<Building, "createdAt" | "updatedAt">;

interface BuildingTableProps {
  data: BuildingRow[];
  page: number;
  pageSize: number;
  totalPages: number;
  onPaginationChange: (next: { page: number; pageSize: number }) => void;
  onEdit: (building: Building) => void;
  onDelete: (building: Building) => void;
}

export function RoomTable({
  data,
  page,
  pageSize,
  totalPages,
  onPaginationChange,
  onEdit,
  onDelete,
}: BuildingTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = useMemo(
    () =>
      roomColumn.map((column) => {
        if (column.id === "actions") {
          return {
            ...column,
            cell: ({ row }: { row: { original: Building } }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${row.original.name}`}>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/administration/locations/${row.original.id}?name=${encodeURIComponent(row.original.name)}&desc=${encodeURIComponent(row.original.description ?? "—")}`}>Offices</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(row.original)}>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete(row.original)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          };
        }
        return column;
      }),
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
    <div className="rounded-lg border pb-3">
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
                <TableCell colSpan={roomColumn.length} className="h-36 text-center">
                  <p className="font-medium">No building found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No building match your current search and filters.
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
