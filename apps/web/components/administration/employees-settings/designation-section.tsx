"use client";

import { useState, useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DesignationTable } from "@/components/administration/employees-designation/designation-table";
import { DesignationDialog } from "@/components/administration/employees-designation/designation-dialog";
import { DesignationDeleteDialog } from "@/components/administration/employees-designation/designation-delete-dialog";
import { CreateDesignationInput, Designation } from "@repo/trpc/schemas";
import { trpc } from "@/lib/trpc/client";

interface DesignationSectionProps {
  employeeDesignations: { designation: string; status: string }[];
}

export function DesignationSection({ employeeDesignations }: DesignationSectionProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const designationsQuery = trpc.designationRouter.getDesignations.useQuery(
    {
      search: search || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData }
  );

  const editDesignationQuery = trpc.designationRouter.getDesignationById.useQuery(
    { id: editId! },
    { enabled: editId !== null }
  );

  const designations = designationsQuery.data?.items ?? [];
  const totalPages = designationsQuery.data?.totalPages ?? 1;

  const derivedEmployeeCounts = useMemo(() => {
    const map = new Map<string, number>();
    employeeDesignations.forEach((emp) => {
      if (!emp.designation) return;
      map.set(emp.designation, (map.get(emp.designation) || 0) + 1);
    });
    return map;
  }, [employeeDesignations]);

  const enrichedDesignations = useMemo(() => {
    return designations.map((des) => ({
      ...des,
      employeeCount: derivedEmployeeCounts.get(des.name) ?? des.employeeCount,
    }));
  }, [designations, derivedEmployeeCounts]);

  const editDefaults = useMemo(() => {
    const des = designations.find((d) => d.id === editId) ?? editDesignationQuery.data;
    return des
      ? {
          name: des.name,
          status: des.status,
        }
      : undefined;
  }, [editId, designations, editDesignationQuery.data]);

  const utils = trpc.useUtils();

  const createDesignation = trpc.designationRouter.create.useMutation({
    onSuccess: () => {
      utils.designationRouter.getDesignations.invalidate();
      setCreateError(null);
      setCreateOpen(false);
      toast.success("Designation created successfully.");
    },
    onError: (error) => {
      setCreateError(error.message ?? "Failed to create designation.");
      toast.error(error.message ?? "Failed to create designation.");
    },
  });

  const handleCreateDesignation = (values: CreateDesignationInput) => {
    setCreateError(null);
    createDesignation.mutate(values);
  };

  const updateDesignation = trpc.designationRouter.update.useMutation({
    onSuccess: () => {
      utils.designationRouter.getDesignations.invalidate();
      utils.designationRouter.getDesignationById.invalidate();
      setEditOpen(false);
      setEditId(null);
      setSelectedDesignation(null);
      toast.success("Designation updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update designation.");
    },
  });

  const handleUpdateDesignation = (values: CreateDesignationInput) => {
    if (editId === null) return;
    updateDesignation.mutate({ id: editId, ...values });
  };

  const deleteDesignation = trpc.designationRouter.delete.useMutation({
    onSuccess: () => {
      utils.designationRouter.getDesignations.invalidate();
      setDeleteOpen(false);
      setSelectedDesignation(null);
      toast.success("Designation deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete designation.");
    },
  });

  const handleDeleteDesignation = () => {
    if (selectedDesignation === null) return;
    deleteDesignation.mutate({ id: selectedDesignation.id });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Designations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage employee designations.
          </p>
        </div>
        <Button onClick={() => {
          setCreateError(null);
          setCreateOpen(true);
        }}>
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
        {designationsQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading designations...</p>
          </div>
        ) : (
          <DesignationTable
            data={enrichedDesignations}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPaginationChange={(next) => {
              setPage(next.page);
              setPageSize(next.pageSize);
            }}
            onEdit={(des) => {
              setEditId(des.id);
              setEditOpen(true);
            }}
            onDelete={(des) => {
              setSelectedDesignation(des);
              setDeleteOpen(true);
            }}
          />
        )}
      </CardContent>

      <DesignationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateDesignation}
        errorMessage={createError}
        onClearError={() => setCreateError(null)}
        title="Create Designation"
      />

      <DesignationDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditId(null);
        }}
        onSubmit={handleUpdateDesignation}
        defaultValues={editDefaults}
        title="Edit Designation"
      />

      <DesignationDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteDesignation}
        designationName={selectedDesignation?.name ?? ""}
      />
    </Card>
  );
}
