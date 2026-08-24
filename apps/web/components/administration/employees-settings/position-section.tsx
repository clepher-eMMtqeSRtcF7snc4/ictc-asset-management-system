"use client";

import { useMemo, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { DataTablePagination } from "@/components/ui/datatable-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import { flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type PaginationState, type SortingState, useReactTable, type VisibilityState } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { createPositionInputSchema, updatePositionInputSchema, type CreatePositionInput, type Position } from "@repo/trpc/schemas";

interface PositionSectionProps {
  employees: { position: string; status: string }[];
}

export function PositionSection({ employees }: PositionSectionProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const derivedPositions = useMemo(() => {
    const map = new Map<string, { count: number; statuses: Set<string> }>();
    employees.forEach((emp) => {
      if (!emp.position) return;
      const entry = map.get(emp.position) || { count: 0, statuses: new Set<string>() };
      entry.count += 1;
      entry.statuses.add(emp.status);
      map.set(emp.position, entry);
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      id: name,
      name,
      status: (data.statuses.has("inactive") || data.statuses.has("retire") ? "inactive" : "active") as "active" | "inactive",
      employeeCount: data.count,
    }));
  }, [employees]);

  useEffect(() => {
    setPositions(derivedPositions);
  }, [derivedPositions]);

  const filteredPositions = useMemo(() => {
    return positions.filter((pos) => {
      const matchesSearch = pos.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || pos.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [positions, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPositions.length / pageSize));
  const paginatedPositions = filteredPositions.slice((page - 1) * pageSize, page * pageSize);

  const createForm = useForm<CreatePositionInput>({
    resolver: zodResolver(createPositionInputSchema),
    defaultValues: { name: "", status: "active" },
  });

  const updateForm = useForm<UpdatePositionInput>({
    resolver: zodResolver(updatePositionInputSchema),
    defaultValues: { id: "", name: "", status: "active" },
  });

  const handleCreateSubmit = createForm.handleSubmit((values) => {
    const newPosition: Position = {
      id: values.name.trim(),
      name: values.name.trim(),
      status: values.status,
      employeeCount: 0,
    };
    setPositions([...positions, newPosition]);
    createForm.reset();
    setCreateOpen(false);
    toast.success("Position created successfully.");
  });

  const handleEditSubmit = updateForm.handleSubmit((values) => {
    if (!selectedPosition) return;
    setPositions(
      positions.map((p) =>
        p.id === selectedPosition.id
          ? { ...p, name: values.name.trim(), status: values.status }
          : p
      )
    );
    updateForm.reset();
    setEditOpen(false);
    setSelectedPosition(null);
    toast.success("Position updated successfully.");
  });

  const handleDelete = () => {
    if (!selectedPosition) return;
    setPositions(positions.filter((p) => p.id !== selectedPosition.id));
    setDeleteOpen(false);
    setSelectedPosition(null);
    toast.success("Position deleted successfully.");
  };

  const openCreateDialog = () => {
    createForm.reset({ name: "", status: "active" });
    setCreateOpen(true);
  };

  const openEditDialog = (position: Position) => {
    setSelectedPosition(position);
    updateForm.reset({ id: position.id, name: position.name, status: position.status });
    setEditOpen(true);
  };

  const columns: ColumnDef<Position>[] = [
    { accessorKey: "name", header: "Position" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            row.original.status === "active"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          {row.original.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      accessorKey: "employeeCount",
      header: "Employees",
      cell: ({ row }) => row.original.employeeCount,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${row.original.name}`}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditDialog(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedPosition(row.original);
                setDeleteOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: paginatedPositions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: { pageIndex: page - 1, pageSize },
    },
    onPaginationChange: (updater) => {
      const next: PaginationState =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize })
          : updater;
      setPage(next.pageIndex + 1);
      setPageSize(next.pageSize);
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Positions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage employee positions.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus /> Create Position
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search positions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value as "all" | "active" | "inactive"); setPage(1); }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg border pb-3">
          <div className="overflow-x-auto">
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
                      <p className="font-medium">No positions found</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        No positions match your current search.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </div>
      </CardContent>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Position</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="grid gap-4 py-4">
            <FieldGroup>
              <Controller
                name="name"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-position-name">Position Name</FieldLabel>
                    <Input
                      {...field}
                      id="create-position-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter position name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="status"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-position-status">Status</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value as "active" | "inactive")}
                    >
                      <SelectTrigger id="create-position-status" className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createForm.formState.isSubmitting}>Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Position</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
            <FieldGroup>
              <Controller
                name="id"
                control={updateForm.control}
                render={() => (
                  <Field>
                    <FieldLabel htmlFor="edit-position-id">ID</FieldLabel>
                    <Input
                      {...updateForm.register("id")}
                      id="edit-position-id"
                      disabled
                    />
                  </Field>
                )}
              />
              <Controller
                name="name"
                control={updateForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-position-name">Position Name</FieldLabel>
                    <Input
                      {...field}
                      id="edit-position-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter position name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="status"
                control={updateForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-position-status">Status</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value as "active" | "inactive")}
                    >
                      <SelectTrigger id="edit-position-status" className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={updateForm.formState.isSubmitting}>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Position?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedPosition?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-end gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
