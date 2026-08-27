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
import { TypeDialog } from "./type-dialog";
import { TypeDeleteDialog } from "./type-delete-dialog";
import { AssetTypeTable } from "./type-table";
import { assetSettingMockType } from "@repo/trpc/schemas";
import type { SettingsAssetType, CreateSettingsAssetTypeInput } from "@repo/trpc/schemas";

// TODO: Replace mockType with tRPC query when backend integration is implemented.

export function TypeSection() {
  const [types, setTypes] = useState<SettingsAssetType[]>(assetSettingMockType);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SettingsAssetType | null>(null);

  const filteredTypes = useMemo(() => {
    return types.filter((type) => {
      const matchesSearch =
        !search ||
        type.name.toLowerCase().includes(search.toLowerCase()) ||
        type.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || type.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [types, search, statusFilter]);

  const handleCreate = (values: CreateSettingsAssetTypeInput) => {
    const newType: SettingsAssetType = {
      id: Date.now(),
      code: values.code,
      name: values.name,
      categoryId: values.categoryId,
      description: values.description ?? null,
      depreciable: values.depreciable,
      defaultUsefulLife: values.defaultUsefulLife,
      status: values.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: null,
      updatedBy: null,
    };
    setTypes([...types, newType]);
    setCreateOpen(false);
    toast.success("Type created successfully.");
  };

  const handleEdit = (values: CreateSettingsAssetTypeInput) => {
    if (!selectedType) return;

    setTypes((prev) =>
      prev.map((type) =>
        type.id === selectedType.id
          ? {
              ...type,
              code: values.code ?? type.code,
              name: values.name ?? type.name,
              categoryId: values.categoryId ?? type.categoryId,
              description: values.description ?? type.description,
              depreciable: values.depreciable ?? type.depreciable,
              defaultUsefulLife: values.defaultUsefulLife ?? type.defaultUsefulLife,
              status: values.status ?? type.status,
              updatedAt: new Date(),
            }
          : type,
      ),
    );

    setEditOpen(false);
    setSelectedType(null);

    toast.success("Type updated successfully.");
  };

  const handleDelete = () => {
    if (!selectedType) return;
    setTypes(types.filter((t) => t.id !== selectedType.id));
    setDeleteOpen(false);
    setSelectedType(null);
    toast.success("Type deleted successfully.");
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
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-sm"
            placeholder="Search types..."
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
        <AssetTypeTable
          data={filteredTypes}
          onEdit={(type) => {
            setSelectedType(type);
            setEditOpen(true);
          }}
          onDelete={(type) => {
            setSelectedType(type);
            setDeleteOpen(true);
          }}
        />
      </CardContent>

      <TypeDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        title="Create Type"
      />

      <TypeDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        defaultValues={
          selectedType
            ? {
                code: selectedType.code,
                name: selectedType.name,
                categoryId: selectedType.categoryId,
                description: selectedType.description,
                depreciable: selectedType.depreciable,
                defaultUsefulLife: selectedType.defaultUsefulLife,
                status: selectedType.status,
              }
            : undefined
        }
        title="Edit Type"
      />

      <TypeDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        typeName={selectedType?.name ?? ""}
      />
    </Card>
  );
}