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
import type { Category, CreateCategoryInput } from "@repo/trpc/schemas";
// import { CategoryFormValues } from "@/packages/trpc/src/schemas/assets/category.schema";
import { mockCategories } from "@/components/administration/master-data/mock-data";

// TODO: Replace mockCategories with tRPC query when backend integration is implemented.

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        !search ||
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || category.status === statusFilter;
      const matchesType = typeFilter === "all" || category.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [categories, search, statusFilter, typeFilter]);

  const handleCreate = (values: CreateCategoryInput) => {
    const newCategory: Category = {
      id: Date.now(),
      code: values.code,
      name: values.name,
      type: values.type,
      description: values.description ?? null,
      depreciable: values.depreciable,
      defaultUsefulLife: values.defaultUsefulLife,
      status: values.status,
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
              code: values.code ?? category.code,
              name: values.name ?? category.name,
              type: values.type ?? category.type,
              description: values.description ?? category.description,
              depreciable: values.depreciable ?? category.depreciable,
              defaultUsefulLife: values.defaultUsefulLife ?? category.defaultUsefulLife,
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

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Asset">Asset</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
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
                code: selectedCategory.code,
                name: selectedCategory.name,
                description: selectedCategory.description,
                type: selectedCategory.type,
                depreciable: selectedCategory.depreciable,
                defaultUsefulLife: selectedCategory.defaultUsefulLife,
                status: selectedCategory.status
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