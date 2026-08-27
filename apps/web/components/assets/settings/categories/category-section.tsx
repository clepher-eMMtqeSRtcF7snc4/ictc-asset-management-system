"use client";

import { useState } from "react";
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
import { trpc } from "@/lib/trpc/client";
import { CreateCategoryInput, SettingsAssetCategory } from "@repo/trpc/schemas";
import { CategoryDialog } from "./category-dialog";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { CategoryTable } from "./category-table";

export function CategorySection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SettingsAssetCategory | null>(null);

  const categoriesQuery = trpc.assetCategoryRouter.getCategories.useQuery(
    {
      search: search || undefined,
      status: statusFilter === "all" ? undefined : (statusFilter as "active" | "inactive"),
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData },
  );

  const categories = (categoriesQuery.data?.items ?? []).map((item) => ({
    ...item,
    createdAt: item.createdAt ? new Date(item.createdAt as unknown as string) : undefined,
    updatedAt: item.updatedAt ? new Date(item.updatedAt as unknown as string) : undefined,
  })) as SettingsAssetCategory[];
  const totalPages = categoriesQuery.data?.totalPages ?? 1;

  const utils = trpc.useUtils();

  const createCategory = trpc.assetCategoryRouter.create.useMutation({
    onSuccess: () => {
      utils.assetCategoryRouter.getCategories.invalidate();
      setCreateOpen(false);
      toast.success("Category created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create category.");
    },
  });

  const updateCategory = trpc.assetCategoryRouter.update.useMutation({
    onSuccess: () => {
      utils.assetCategoryRouter.getCategories.invalidate();
      setEditOpen(false);
      setSelectedCategory(null);
      toast.success("Category updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update category.");
    },
  });

  const deleteCategory = trpc.assetCategoryRouter.delete.useMutation({
    onSuccess: () => {
      utils.assetCategoryRouter.getCategories.invalidate();
      setDeleteOpen(false);
      setSelectedCategory(null);
      toast.success("Category deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete category.");
    },
  });

  const handleCreate = (values: CreateCategoryInput) => {
    createCategory.mutate(values);
  };

  const handleEdit = (values: CreateCategoryInput) => {
    if (!selectedCategory) return;
    updateCategory.mutate({ id: selectedCategory.id, ...values });
  };

  const handleDelete = () => {
    if (!selectedCategory) return;
    deleteCategory.mutate({ id: selectedCategory.id });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Asset Categories</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage asset categories used for classification and reporting.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Create Category
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-sm"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
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

        {categoriesQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        ) : (
          <CategoryTable
            data={categories}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPaginationChange={(next) => {
              setPage(next.page);
              setPageSize(next.pageSize);
            }}
            onEdit={(category) => {
              setSelectedCategory(category);
              setEditOpen(true);
            }}
            onDelete={(category) => {
              setSelectedCategory(category);
              setDeleteOpen(true);
            }}
          />
        )}
      </CardContent>

      <CategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        title="Create Category"
        isLoading={createCategory.isPending}
      />

      <CategoryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        defaultValues={
          selectedCategory
            ? {
                name: selectedCategory.name,
                description: selectedCategory.description,
                status: selectedCategory.status,
              }
            : undefined
        }
        title="Edit Category"
        isLoading={updateCategory.isPending}
      />

      <CategoryDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        categoryName={selectedCategory?.name ?? ""}
      />
    </Card>
  );
}
