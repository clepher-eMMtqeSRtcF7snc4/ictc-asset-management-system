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
import { ConditionDialog } from "./condition-dialog";
import { ConditionDeleteDialog } from "./condition-delete-dialog";
import { ConditionsTable } from "./conditions-table";
import type { AssetCondition } from "@/components/master-data/types";
import type { ConditionFormValues } from "./condition-form-schema";
import { mockConditions } from "@/components/master-data/mock-data";

// TODO: Replace mockConditions with tRPC query when backend integration is implemented.

export function ConditionsSection() {
  const [conditions, setConditions] = useState<AssetCondition[]>(mockConditions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<AssetCondition | null>(null);

  const filteredConditions = useMemo(() => {
    return conditions.filter((condition) => {
      const matchesSearch =
        !search ||
        condition.name.toLowerCase().includes(search.toLowerCase()) ||
        condition.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || condition.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [conditions, search, statusFilter]);

  const handleCreate = (values: ConditionFormValues) => {
    const newCondition: AssetCondition = {
      id: Date.now().toString(),
      code: values.code,
      name: values.name,
      description: values.description || "",
      severity: "Good",
      assetCount: 0,
      status: values.status,
    };
    setConditions([...conditions, newCondition]);
    setCreateOpen(false);
    toast.success("Condition created successfully.");
  };

  const handleEdit = (values: ConditionFormValues) => {
    if (!selectedCondition) return;
    setConditions(
      conditions.map((c) =>
        c.id === selectedCondition.id
          ? {
              ...c,
              code: values.code,
              name: values.name,
              description: values.description || "",
              status: values.status,
            }
          : c
      )
    );
    setEditOpen(false);
    setSelectedCondition(null);
    toast.success("Condition updated successfully.");
  };

  const handleDelete = () => {
    if (!selectedCondition) return;
    setConditions(conditions.filter((c) => c.id !== selectedCondition.id));
    setDeleteOpen(false);
    setSelectedCondition(null);
    toast.success("Condition deleted successfully.");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Asset Conditions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage physical and operational condition values used during
            registration, maintenance, and physical verification.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Create Condition
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-sm"
            placeholder="Search conditions..."
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
        <ConditionsTable
          data={filteredConditions}
          onEdit={(condition) => {
            setSelectedCondition(condition);
            setEditOpen(true);
          }}
          onDelete={(condition) => {
            setSelectedCondition(condition);
            setDeleteOpen(true);
          }}
        />
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
                description: selectedCondition.description,
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
