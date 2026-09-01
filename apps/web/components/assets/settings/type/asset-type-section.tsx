"use client";

import { useEffect, useMemo, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { AssetTypeDialog } from "./asset-type-dialog";
import { AssetTypeDeleteDialog } from "./asset-type-delete-dialog";
import { AssetTypeTable } from "./asset-type-table";
import type { SettingsAssetType, CreateSettingsAssetTypeInput, SettingsAssetCategory } from "@repo/trpc/schemas";
import { AssetTypeFilters } from "./asset-type-filters";

export function AssetTypeSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [categoryId, setCategoryId] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SettingsAssetType | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryId]);

  const typesQuery = trpc.assetTypeRouter.getAssetTypes.useQuery(
    {
      search: search || undefined,
      status: statusFilter === "all" ? undefined : (statusFilter as "active" | "inactive"),
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData },
  );

  const categoriesQuery = trpc.assetCategoryRouter.getCategories.useQuery(
    { page: 1, pageSize: 100 },
    { placeholderData: keepPreviousData },
  );

  // Fallback to mock categories if no categories fetched
  const categories = (categoriesQuery.data?.items ?? []) as SettingsAssetCategory[];
  const totalPages = typesQuery.data?.totalPages ?? 1;

  const filteredData = useMemo(() => {
    const items = typesQuery.data?.items ?? [];
    if (categoryId === "all") return items;
    return items.filter((item) => String(item.assetCategoryId) === categoryId);
  }, [typesQuery.data?.items, categoryId]);

  const utils = trpc.useUtils();

  const createType = trpc.assetTypeRouter.create.useMutation({
    onSuccess: () => {
      utils.assetTypeRouter.getAssetTypes.invalidate();
      setCreateOpen(false);
      toast.success("Asset type created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create asset type.");
    },
  });

  const updateType = trpc.assetTypeRouter.update.useMutation({
    onSuccess: () => {
      utils.assetTypeRouter.getAssetTypes.invalidate();
      setEditOpen(false);
      setSelectedType(null);
      toast.success("Asset type updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update asset type.");
    },
  });

  const deleteType = trpc.assetTypeRouter.delete.useMutation({
    onSuccess: () => {
      utils.assetTypeRouter.getAssetTypes.invalidate();
      setDeleteOpen(false);
      setSelectedType(null);
      toast.success("Asset type deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete asset type.");
    },
  });

  const handleCreate = (values: CreateSettingsAssetTypeInput) => {
    createType.mutate(values);
  };

  const handleEdit = (values: CreateSettingsAssetTypeInput) => {
    if (!selectedType) return;
    updateType.mutate({ id: selectedType.id, ...values });
  };

  const handleDelete = () => {
    if (!selectedType) return;
    deleteType.mutate({ id: selectedType.id });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Asset Types</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage asset types used for classification and reporting.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Create Type
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
  
        <AssetTypeFilters
          search={search}
          setSearch={setSearch}
          status={statusFilter}
          setStatus={setStatusFilter}
          categories={categories}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
        />

        {typesQuery.isLoading || categoriesQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading asset types...</p>
          </div>
        ) : (
          <AssetTypeTable
            data={filteredData.map((item) => ({
              ...item,
              createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
              updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
            })) as SettingsAssetType[]}
            categories={categories}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPaginationChange={(next) => {
              setPage(next.page);
              setPageSize(next.pageSize);
            }}
            onEdit={(type) => {
              setSelectedType(type);
              setEditOpen(true);
            }}
            onDelete={(type) => {
              setSelectedType(type);
              setDeleteOpen(true);
            }}
          />
        )}
      </CardContent>

      <AssetTypeDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        title="Create Asset Type"
        isLoading={createType.isPending}
        categories={categories}
      />

      <AssetTypeDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        defaultValues={
          selectedType
            ? {
                code: selectedType.code,
                name: selectedType.name,
                assetCategoryId: selectedType.assetCategoryId,
                description: selectedType.description,
                depreciable: selectedType.depreciable,
                defaultUsefulLife: selectedType.defaultUsefulLife,
                status: selectedType.status,
              }
            : undefined
        }
        title="Edit Asset Type"
        isLoading={updateType.isPending}
        categories={categories}
      />

      <AssetTypeDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        typeName={selectedType?.name ?? ""}
      />
    </Card>
  );
}