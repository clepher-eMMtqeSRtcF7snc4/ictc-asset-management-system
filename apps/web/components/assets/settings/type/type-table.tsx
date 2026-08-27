"use client";

import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, type SortingState, useReactTable, type VisibilityState } from "@tanstack/react-table";
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
import { typeColumns } from "./type-columns";
import type { SettingsAssetType } from "@repo/trpc/schemas";
import { mockCategories } from "@/components/administration/master-data/mock-data";

interface AssetTypeTableProps {
  data: SettingsAssetType[];
  onEdit: (assetType: SettingsAssetType) => void;
  onDelete: (assetType: SettingsAssetType) => void;
}

export function AssetTypeTable({ data, onEdit, onDelete }: AssetTypeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Create a map of categories for looking up category names
  const categoriesMap = useMemo(() => {
    return new Map(mockCategories.map(category => [category.id, category]));
  }, [mockCategories]);

  const columns = useMemo(() => {
    return typeColumns.map(column => {
      if ((column as any).accessorKey === "categoryId") {
        return {
          ...column,
          header: "Category",
          cell: ({ row }: { row: { original: SettingsAssetType } }) => {
            const category = categoriesMap.get(row.original.categoryId);
            return <span className="font-medium">{category ? category.name : `Unknown (${row.original.categoryId})`}</span>;
          }
        };
      }
      return column;
    });
  }, [typeColumns, categoriesMap]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility },
    initialState: { pagination: { pageSize: 10 } },
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
                <TableCell colSpan={columns.length} className="h-36 text-center">
                  <p className="font-medium">No types found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No types match your current search and filters.
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