"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@repo/trpc/schemas";
import { Edit3, Plus, Search, ToggleLeft } from "lucide-react";
import { startTransition, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const categoryFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Category code is required")
    .max(50)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Use only letters, numbers, hyphens, or underscores",
    ),
  name: z.string().trim().min(1, "Category name is required").max(150),
  type: z.enum(["Asset", "Inventory"]),
});
type CategoryFormValues = z.infer<typeof categoryFormSchema>;
type ActionResult = { ok: boolean; message?: string };

function CategoryFormDialog({
  record,
  open,
  onOpenChange,
  onCreate,
  onUpdate,
}: {
  record: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: CreateCategoryInput) => Promise<ActionResult>;
  onUpdate: (input: UpdateCategoryInput) => Promise<ActionResult>;
}) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    values: record
      ? {
          code: record.code,
          name: record.name,
          type: record.type as "Asset" | "Inventory",
        }
      : { code: "", name: "", type: "Asset" },
  });
  const [saving, setSaving] = useState(false);
  const submit = async (values: CategoryFormValues) => {
    setSaving(true);
    const result = record
      ? await onUpdate({ id: record.id, ...values })
      : await onCreate(values);
    setSaving(false);
    if (!result.ok)
      return toast.error(result.message ?? "Unable to save category.");
    toast.success(`Category successfully ${record ? "updated" : "created"}.`);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {record ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            Classify asset and inventory records with controlled categories.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(submit)}>
          <div>
            <Label htmlFor="category-code">Category Code</Label>
            <Input
              id="category-code"
              className="mt-1"
              {...form.register("code")}
            />
            {form.formState.errors.code && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              className="mt-1"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label>Category Type</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(type) =>
                form.setValue("type", type as CategoryFormValues["type"])
              }
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asset">Asset</SelectItem>
                <SelectItem value="Inventory">Inventory</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : record
                  ? "Save Category"
                  : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CategoriesContentSection({
  categories,
  error,
  onCreate,
  onUpdate,
  onSetStatus,
}: {
  categories: Category[];
  error?: string;
  onCreate: (input: CreateCategoryInput) => Promise<ActionResult>;
  onUpdate: (input: UpdateCategoryInput) => Promise<ActionResult>;
  onSetStatus: (input: {
    id: number;
    status: "active" | "inactive";
  }) => Promise<ActionResult>;
}) {
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<{
    open: boolean;
    record: Category | null;
  }>({ open: false, record: null });
  const filtered = useMemo(
    () =>
      categories.filter((category) =>
        `${category.code} ${category.name} ${category.type}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [categories, search],
  );
  const toggle = (category: Category) =>
    startTransition(async () => {
      const status = category.status === "active" ? "inactive" : "active";
      const result = await onSetStatus({ id: category.id, status });
      result.ok
        ? toast.success(
            `Category ${status === "active" ? "activated" : "deactivated"}.`,
          )
        : toast.error(result.message ?? "Unable to update category.");
    });
  const assetCount = categories.filter(
    (category) => category.type === "Asset",
  ).length;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage categories used to classify assets and inventory items.
          </p>
        </div>
        <Button onClick={() => setDialog({ open: true, record: null })}>
          <Plus /> Create Category
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [categories.length, "Total Categories"],
          [assetCount, "Asset Categories"],
          [categories.length - assetCount, "Inventory Categories"],
          [
            categories.filter((category) => category.status === "active")
              .length,
            "Active Categories",
          ],
        ].map(([value, label]) => (
          <Card key={String(label)}>
            <CardContent className="p-4">
              <p className="text-2xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                placeholder="Search categories..."
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {filtered.length} results
            </span>
          </div>
          {error ? (
            <p className="p-6 text-sm text-destructive">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {["Code", "Category Name", "Type", "Status", "Actions"].map(
                    (heading) => (
                      <TableHead key={heading}>{heading}</TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-mono text-xs text-primary">
                        {category.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>{category.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            category.status === "active"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-1">
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() =>
                            setDialog({ open: true, record: category })
                          }
                        >
                          <Edit3 /> Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => toggle(category)}
                        >
                          <ToggleLeft />{" "}
                          {category.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-28 text-center text-muted-foreground"
                    >
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <CategoryFormDialog
        record={dialog.record}
        open={dialog.open}
        onOpenChange={(open) => setDialog((state) => ({ ...state, open }))}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </div>
  );
}
