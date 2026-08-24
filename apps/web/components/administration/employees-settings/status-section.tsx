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
import { createStatusInputSchema, updateStatusInputSchema, type CreateStatusInput, type EmployeeSettingStatus } from "@repo/trpc/schemas";

interface StatusSectionProps {
  employees: { status: string }[];
}

export function StatusSection({ employees }: StatusSectionProps) {
  const [statuses, setStatuses] = useState<EmployeeSettingStatus[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<EmployeeSettingStatus | null>(null);

  const derivedStatuses = useMemo(() => {
    const map = new Map<string, number>();
    employees.forEach((emp) => {
      map.set(emp.status, (map.get(emp.status) || 0) + 1);
    });
    const labels: Record<string, string> = {
      active: "Active",
      inactive: "Inactive",
      retire: "Retire",
    };
    return Array.from(map.entries()).map(([value, count]) => ({
      id: value,
      name: labels[value] || value,
      value,
      status: "active" as const,
      employeeCount: count,
    }));
  }, [employees]);

  useEffect(() => {
    setStatuses(derivedStatuses);
  }, [derivedStatuses]);

  const filteredStatuses = useMemo(() => {
    return statuses.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.value.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [statuses, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStatuses.length / pageSize));
  const paginatedStatuses = filteredStatuses.slice((page - 1) * pageSize, page * pageSize);

  const createForm = useForm<CreateStatusInput>({
    resolver: zodResolver(createStatusInputSchema),
    defaultValues: { name: "", value: "", status: "active" },
  });

  const updateForm = useForm<UpdateStatusInput>({
    resolver: zodResolver(updateStatusInputSchema),
    defaultValues: { id: "", name: "", value: "", status: "active" },
  });

  const handleCreateSubmit = createForm.handleSubmit((values) => {
    const newStatus: EmployeeSettingStatus = {
      id: values.value.trim().toLowerCase().replace(/\s+/g, "_"),
      name: values.name.trim(),
      value: values.value.trim().toLowerCase().replace(/\s+/g, "_"),
      status: values.status,
      employeeCount: 0,
    };
    setStatuses([...statuses, newStatus]);
    createForm.reset();
    setCreateOpen(false);
    toast.success("Status created successfully.");
  });

  const handleEditSubmit = updateForm.handleSubmit((values) => {
    if (!selectedStatus) return;
    const newValue = values.value.trim().toLowerCase().replace(/\s+/g, "_");
    setStatuses(
      statuses.map((s) =>
        s.id === selectedStatus.id
          ? { ...s, name: values.name.trim(), value: newValue, id: newValue, status: values.status }
          : s
      )
    );
    updateForm.reset();
    setEditOpen(false);
    setSelectedStatus(null);
    toast.success("Status updated successfully.");
  });

  const handleDelete = () => {
    if (!selectedStatus) return;
    setStatuses(statuses.filter((s) => s.id !== selectedStatus.id));
    setDeleteOpen(false);
    setSelectedStatus(null);
    toast.success("Status deleted successfully.");
  };

  const openCreateDialog = () => {
    createForm.reset({ name: "", value: "", status: "active" });
    setCreateOpen(true);
  };

  const openEditDialog = (status: EmployeeSettingStatus) => {
    setSelectedStatus(status);
    updateForm.reset({ id: status.id, name: status.name, value: status.value, status: status.status });
    setEditOpen(true);
  };

  const columns: ColumnDef<EmployeeSettingStatus>[] = [
    { accessorKey: "name", header: "Status" },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.original.value}</code>
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
                setSelectedStatus(row.original);
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
    data: paginatedStatuses,
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
          <CardTitle>Statuses</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage employee statuses.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus /> Create Status
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search statuses..."
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
                      <p className="font-medium">No statuses found</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        No statuses match your current search.
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
            <DialogTitle>Create Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="grid gap-4 py-4">
            <FieldGroup>
              <Controller
                name="name"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-status-name">Status Name</FieldLabel>
                    <Input
                      {...field}
                      id="create-status-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter status name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="value"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-status-value">Status Value</FieldLabel>
                    <Input
                      {...field}
                      id="create-status-value"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. active, inactive, retire"
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
                    <FieldLabel htmlFor="create-status-status">Status</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value as "active" | "inactive")}
                    >
                      <SelectTrigger id="create-status-status" className="w-full">
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
            <DialogTitle>Edit Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
            <FieldGroup>
              <Controller
                name="id"
                control={updateForm.control}
                render={() => (
                  <Field>
                    <FieldLabel htmlFor="edit-status-id">ID</FieldLabel>
                    <Input
                      {...updateForm.register("id")}
                      id="edit-status-id"
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
                    <FieldLabel htmlFor="edit-status-name">Status Name</FieldLabel>
                    <Input
                      {...field}
                      id="edit-status-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter status name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="value"
                control={updateForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-status-value">Status Value</FieldLabel>
                    <Input
                      {...field}
                      id="edit-status-value"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. active, inactive, retire"
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
                    <FieldLabel htmlFor="edit-status-status">Status</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value as "active" | "inactive")}
                    >
                      <SelectTrigger id="edit-status-status" className="w-full">
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
            <AlertDialogTitle>Delete Status?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedStatus?.name}&quot;? This action cannot be undone.
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
