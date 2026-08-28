"use client";

import { useEffect, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { StatusDialog } from "./status-dialog";
import { StatusDeleteDialog } from "./status-delete-dialog";
import { StatusesTable } from "./statuses-table";
import type { CreateAssetStatusInput, SettingsAssetStatus, UpdateAssetStatusInput } from "@repo/trpc/schemas";
import { StatusFilters } from "./status-filters";

export function StatusesSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<SettingsAssetStatus | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const statusesQuery = trpc.assetStatusRouter.getAssetStatuses.useQuery(
    {
      search: search || undefined,
      status: statusFilter === "all" ? undefined : (statusFilter as "active" | "inactive"),
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData },
  );

  const totalPages = statusesQuery.data?.totalPages ?? 1;

  const utils = trpc.useUtils();

  const createStatus = trpc.assetStatusRouter.create.useMutation({
    onSuccess: () => {
      utils.assetStatusRouter.getAssetStatuses.invalidate();
      setCreateOpen(false);
      toast.success("Asset status created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create asset status.");
    },
  });

  const updateStatus = trpc.assetStatusRouter.update.useMutation({
    onSuccess: () => {
      utils.assetStatusRouter.getAssetStatuses.invalidate();
      setEditOpen(false);
      setSelectedStatus(null);
      toast.success("Asset status updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update asset status.");
    },
  });

  const deleteStatus = trpc.assetStatusRouter.delete.useMutation({
    onSuccess: () => {
      utils.assetStatusRouter.getAssetStatuses.invalidate();
      setDeleteOpen(false);
      setSelectedStatus(null);
      toast.success("Asset status deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete asset status.");
    },
  });

  const handleCreate = (values: CreateAssetStatusInput) => {
    createStatus.mutate(values);
  };

  const handleEdit = (values: UpdateAssetStatusInput) => {
    if (!selectedStatus) return;
    updateStatus.mutate({ id: selectedStatus.id, ...values });
  };

  const handleDelete = () => {
    if (!selectedStatus) return;
    deleteStatus.mutate({ id: selectedStatus.id });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Asset Statuses</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage lifecycle statuses used by assets.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Create Status
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatusFilters
          search={search}
          setSearch={setSearch}
          status={statusFilter}
          setStatus={setStatusFilter}
        />

        {statusesQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading asset statuses...</p>
          </div>
        ) : (
          <StatusesTable
            data={(statusesQuery.data?.items ?? []).map((item) => ({
              ...item,
              createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
              updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
            })) as SettingsAssetStatus[]}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPaginationChange={(next) => {
              setPage(next.page);
              setPageSize(next.pageSize);
            }}
            onEdit={(status) => {
              setSelectedStatus(status);
              setEditOpen(true);
            }}
            onDelete={(status) => {
              setSelectedStatus(status);
              setDeleteOpen(true);
            }}
          />
        )}
      </CardContent>

      <StatusDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        title="Create Status"
        isLoading={createStatus.isPending}
      />

      <StatusDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        defaultValues={
          selectedStatus
            ? {
                code: selectedStatus.code,
                name: selectedStatus.name,
                description: selectedStatus.description ?? null,
                status: selectedStatus.status,
              }
            : undefined
        }
        title="Edit Status"
        isLoading={updateStatus.isPending}
      />

      <StatusDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        statusName={selectedStatus?.name ?? ""}
      />
    </Card>
  );
}