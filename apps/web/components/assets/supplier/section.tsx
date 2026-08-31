"use client";

import { useEffect, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { AssetCondition, CreateAssetConditionInput, UpdateAssetConditionInput } from "@repo/trpc/schemas";
import { SupplierDeleteDialog } from "./delete-dialog";
import { ConditionFilters } from "./filters";
import { ConditionsTable } from "./table";
import { ConditionDialog } from "./dialog";

export function ConditionsSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<AssetCondition | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const conditionsQuery = trpc.assetConditionRouter.getAssetConditions.useQuery(
    {
      search: search || undefined,
      status: statusFilter === "all" ? undefined : (statusFilter as "active" | "inactive"),
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData },
  );

  const totalPages = conditionsQuery.data?.totalPages ?? 1;

  const utils = trpc.useUtils();

  const createCondition = trpc.assetConditionRouter.create.useMutation({
    onSuccess: () => {
      utils.assetConditionRouter.getAssetConditions.invalidate();
      setCreateOpen(false);
      toast.success("Asset condition created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create asset condition.");
    },
  });

  const updateCondition = trpc.assetConditionRouter.update.useMutation({
    onSuccess: () => {
      utils.assetConditionRouter.getAssetConditions.invalidate();
      setEditOpen(false);
      setSelectedCondition(null);
      toast.success("Asset condition updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update asset condition.");
    },
  });

  const deleteCondition = trpc.assetConditionRouter.delete.useMutation({
    onSuccess: () => {
      utils.assetConditionRouter.getAssetConditions.invalidate();
      setDeleteOpen(false);
      setSelectedCondition(null);
      toast.success("Asset condition deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete asset condition.");
    },
  });

  const handleCreate = (values: CreateAssetConditionInput) => {
    createCondition.mutate(values);
  };

  const handleEdit = (values: UpdateAssetConditionInput) => {
    if (!selectedCondition) return;
    updateCondition.mutate({ id: selectedCondition.id, ...values });
  };

  const handleDelete = () => {
    if (!selectedCondition) return;
    deleteCondition.mutate({ id: selectedCondition.id });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Asset Conditions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage condition statuses used for asset evaluation.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Create Condition
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <ConditionFilters
          search={search}
          setSearch={setSearch}
          status={statusFilter}
          setStatus={setStatusFilter}
        />

        {conditionsQuery.isLoading ? (
           <div className="flex items-center justify-center py-8">
             <p className="text-muted-foreground">Loading asset conditions...</p>
           </div>
         ) : (
           <ConditionsTable
             data={(conditionsQuery.data?.items ?? []).map((item) => ({
                ...item,
                createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
                updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
              })) as AssetCondition[]}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              onPaginationChange={(next) => {
                setPage(next.page);
                setPageSize(next.pageSize);
              }}
              onEdit={(status) => {
                setSelectedCondition(status);
                setEditOpen(true);
              }}
              onDelete={(status) => {
                setSelectedCondition(status);
                setDeleteOpen(true);
              }}
           />
         )}
      </CardContent>

      <ConditionDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        title="Create Condition"
      />

      <ConditionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        defaultValues={
          selectedCondition
            ? {
                code: selectedCondition.code,
                name: selectedCondition.name,
                description: selectedCondition.description ?? null,
                status: selectedCondition.status,
              }
            : undefined
        }
        title="Edit Condition"
      />

      <ConditionDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        conditionName={selectedCondition?.name ?? ""}
      />
    </Card>
  );
}