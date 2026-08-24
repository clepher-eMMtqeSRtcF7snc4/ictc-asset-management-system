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
import { flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, type PaginationState, useReactTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { createDesignationInputSchema, updateDesignationInputSchema, type CreateDesignationInput, type Designation } from "@repo/trpc/schemas";

interface DesignationSectionProps {
  employees: { designation: string; status: string }[];
}

export function DesignationSection({ employees }: DesignationSectionProps) {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);

  const derivedDesignations = useMemo(() => {
    const map = new Map<string, { count: number; statuses: Set<string> }>();
    employees.forEach((emp) => {
      if (!emp.designation) return;
      const entry = map.get(emp.designation) || { count: 0, statuses: new Set<string>() };
      entry.count += 1;
      entry.statuses.add(emp.status);
      map.set(emp.designation, entry);
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      id: name,
      name,
      status: (data.statuses.has("inactive") || data.statuses.has("retire") ? "inactive" : "active") as "active" | "inactive",
      employeeCount: data.count,
    }));
  }, [employees]);

  useEffect(() => {
    setDesignations(derivedDesignations);
  }, [derivedDesignations]);

  const filteredDesignations = useMemo(() => {
    return designations.filter((des) => {
      const matchesSearch = des.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || des.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [designations, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDesignations.length / pageSize));
  const paginatedDesignations = filteredDesignations.slice((page - 1) * pageSize, page * pageSize);

  const createForm = useForm<CreateDesignationInput>({
    resolver: zodResolver(createDesignationInputSchema),
    defaultValues: { name: "", status: "active" },
  });

  const updateForm = useForm<UpdateDesignationInput>({
    resolver: zodResolver(updateDesignationInputSchema),
    defaultValues: { id: "", name: "", status: "active" },
  });

  const handleCreateSubmit = createForm.handleSubmit((values) => {
    const newDesignation: Designation = {
      id: values.name.trim(),
      name: values.name.trim(),
      status: values.status,
      employeeCount: 0,
    };
    setDesignations([...designations, newDesignation]);
    createForm.reset();
    setCreateOpen(false);
    toast.success("Designation created successfully.");
  });

  const handleEditSubmit = updateForm.handleSubmit((values) => {
    if (!selectedDesignation) return;
    setDesignations(
      designations.map((d) =>
        d.id === selectedDesignation.id
          ? { ...d, name: values.name.trim(), status: values.status }
          : d
      )
    );
    updateForm.reset();
    setEditOpen(false);
    setSelectedDesignation(null);
    toast.success("Designation updated successfully.");
  });

  const handleDelete = () => {
    if (!selectedDesignation) return;
    setDesignations(designations.filter((d) => d.id !== selectedDesignation.id));
    setDeleteOpen(false);
    setSelectedDesignation(null);
    toast.success("Designation deleted successfully.");
  };

  const openCreateDialog = () => {
    createForm.reset({ name: "", status: "active" });
    setCreateOpen(true);
  };

  const openEditDialog = (designation: Designation) => {
    setSelectedDesignation(designation);
    updateForm.reset({ id: designation.id, name: designation.name, status: designation.status });
    setEditOpen(true);
  };

  const columns: ColumnDef<Designation>[] = [
    { accessorKey: "name", header: "Designation" },
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
                setSelectedDesignation(row.original);
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
    data: paginatedDesignations,
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
          <CardTitle>Designations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage employee designations.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus /> Create Designation
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search designations..."
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
                      <p className="font-medium">No designations found</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        No designations match your current search.
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
            <DialogTitle>Create Designation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="grid gap-4 py-4">
            <FieldGroup>
              <Controller
                name="name"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-designation-name">Designation Name</FieldLabel>
                    <Input
                      {...field}
                      id="create-designation-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter designation name"
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
                    <FieldLabel htmlFor="create-designation-status">Status</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value as "active" | "inactive")}
                    >
                      <SelectTrigger id="create-designation-status" className="w-full">
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
            <DialogTitle>Edit Designation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
            <FieldGroup>
              <Controller
                name="id"
                control={updateForm.control}
                render={() => (
                  <Field>
                    <FieldLabel htmlFor="edit-designation-id">ID</FieldLabel>
                    <Input
                      {...updateForm.register("id")}
                      id="edit-designation-id"
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
                    <FieldLabel htmlFor="edit-designation-name">Designation Name</FieldLabel>
                    <Input
                      {...field}
                      id="edit-designation-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter designation name"
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
                    <FieldLabel htmlFor="edit-designation-status">Status</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value as "active" | "inactive")}
                    >
                      <SelectTrigger id="edit-designation-status" className="w-full">
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
            <AlertDialogTitle>Delete Designation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedDesignation?.name}&quot;? This action cannot be undone.
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
