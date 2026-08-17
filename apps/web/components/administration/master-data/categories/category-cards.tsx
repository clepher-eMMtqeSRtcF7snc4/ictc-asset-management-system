"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { CategoryDialog } from "./category-dialog";
import { CategoryDeleteDialog } from "./category-delete-dialog";
import type { Category } from "@repo/trpc/schemas";
import type { CategoryFormValues } from "./category-form-schema";
import { mockCategories } from "@/components/administration/master-data/mock-data";

// TODO: Replace mockCategories with tRPC query when backend integration is implemented.

const categoryIcons: Record<string, string> = {
  Laptop: "💻",
  Desktop: "🖥",
  Monitor: "🖵",
  Printer: "🖶",
  Server: "🖳",
  "Network Switch": "🔌",
};

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="text-2xl">{categoryIcons[category.name] || "📦"}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${category.name}`}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(category)}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2">
        <CardTitle className="text-base">{category.name}</CardTitle>
        <p className="text-xs text-muted-foreground font-mono">{category.code}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">128 Assets</span>
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${category.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
            {category.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryCards() {
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

  const handleCreate = (values: CategoryFormValues) => {
    const newCategory: Category = {
      id: Date.now(),
      code: values.code,
      name: values.name,
      type: values.type as Category["type"],
      description: values.description || null,
      parentCategoryId: null,
      depreciable: values.depreciable,
      defaultUsefulLife: values.defaultUsefulLife,
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

  const handleEdit = (values: CategoryFormValues) => {
    if (!selectedCategory) return;
    setCategories(
      categories.map((c) =>
        c.id === selectedCategory.id
          ? {
              ...c,
              code: values.code,
              name: values.name,
              type: values.type as Category["type"],
              description: values.description || null,
              depreciable: values.depreciable,
              defaultUsefulLife: values.defaultUsefulLife,
              status: values.status,
              updatedAt: new Date(),
            }
          : c
      )
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
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
        <Button onClick={() => setCreateOpen(true)}>Create Category</Button>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={(cat) => {
                setSelectedCategory(cat);
                setEditOpen(true);
              }}
              onDelete={(cat) => {
                setSelectedCategory(cat);
                setDeleteOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">No categories found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No categories match your current search and filters.
          </p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            Create Category
          </Button>
        </div>
      )}

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
                description: selectedCategory.description || "",
                type: selectedCategory.type,
                depreciable: selectedCategory.depreciable,
                defaultUsefulLife: selectedCategory.defaultUsefulLife || undefined,
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
    </div>
  );
}
