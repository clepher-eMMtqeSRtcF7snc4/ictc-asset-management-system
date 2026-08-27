"use client";

import { useState, useMemo } from "react";
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
import { CategoryDialog } from "./category-dialog";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import { CategoryTable } from "./category-table";
import type { SettingsAssetCategory, CreateCategoryInput } from "@repo/trpc/schemas";
import { assetSettingsMockCategories } from "@repo/trpc/schemas";

// TODO: Replace assetSettingsMockCategories with tRPC query when backend integration is implemented.

export function CategorySection() {
  const [categories, setCategories] = useState<SettingsAssetCategory[]>(assetSettingsMockCategories);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SettingsAssetCategory | null>(null);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        !search ||
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        (category.description?.toLowerCase() ?? "").includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || category.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const handleCreate = (values: CreateCategoryInput) => {
    const newCategory: SettingsAssetCategory = {
      id: Date.now(),
      name: values.name,
      description: values.description ?? null,
      status: values.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: null,
      updatedBy: null,
    };
    setCategories([...categories, newCategory]);
    setCreateOpen(false);
    toast.success("Category created successfully.");
  };

  const handleEdit = (values: CreateCategoryInput) => {
    if (!selectedCategory) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              name: values.name ?? category.name,
              description: values.description ?? category.description,
              status: values.status ?? category.status,
              updatedAt: new Date(),
            }
          : category,
      ),
    );

    setEditOpen(false);
    setSelectedCategory(null);

    toast.success("Category updated successfully.");
  };

  const handleDelete = () => {
    if (!selectedCategory) return;
    setCategories(categories.filter((c) => c.id !== selectedCategory.id));
    setDeleteOpen(false);
    setSelectedCategory(null);
    toast.success("Category deleted successfully.");
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
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
        <CategoryTable
          data={filteredCategories}
          onEdit={(category) => {
            setSelectedCategory(category);
            setEditOpen(true);
          }}
          onDelete={(category) => {
            setSelectedCategory(category);
            setDeleteOpen(true);
          }}
        />
      </CardContent>

      <CategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        title="Create Category"
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