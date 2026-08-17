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
import { StatusDialog } from "./status-dialog";
import { StatusDeleteDialog } from "./status-delete-dialog";
import { StatusesTable } from "./statuses-table";
import type { AssetStatus } from "@/components/master-data/types";
import type { StatusFormValues } from "./status-form-schema";
import { mockStatuses } from "@/components/master-data/mock-data";

// TODO: Replace mockStatuses with tRPC query when backend integration is implemented.

export function StatusesSection() {
  const [statuses, setStatuses] = useState<AssetStatus[]>(mockStatuses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<AssetStatus | null>(null);

  const filteredStatuses = useMemo(() => {
    return statuses.filter((status) => {
      const matchesSearch =
        !search ||
        status.name.toLowerCase().includes(search.toLowerCase()) ||
        status.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || status.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [statuses, search, statusFilter]);

  const handleCreate = (values: StatusFormValues) => {
    const newStatus: AssetStatus = {
      id: Date.now().toString(),
      code: values.code,
      name: values.name,
      description: values.description || "",
      color: "info",
      assetCount: 0,
      status: values.status,
    };
    setStatuses([...statuses, newStatus]);
    setCreateOpen(false);
    toast.success("Status created successfully.");
  };

  const handleEdit = (values: StatusFormValues) => {
    if (!selectedStatus) return;
    setStatuses(
      statuses.map((s) =>
        s.id === selectedStatus.id
          ? {
              ...s,
              code: values.code,
              name: values.name,
              description: values.description || "",
              status: values.status,
            }
          : s
      )
    );
    setEditOpen(false);
    setSelectedStatus(null);
    toast.success("Status updated successfully.");
  };

  const handleDelete = () => {
    if (!selectedStatus) return;
    setStatuses(statuses.filter((s) => s.id !== selectedStatus.id));
    setDeleteOpen(false);
    setSelectedStatus(null);
    toast.success("Status deleted successfully.");
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
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-sm"
            placeholder="Search statuses..."
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
        <StatusesTable
          data={filteredStatuses}
          onEdit={(status) => {
            setSelectedStatus(status);
            setEditOpen(true);
          }}
          onDelete={(status) => {
            setSelectedStatus(status);
            setDeleteOpen(true);
          }}
        />
      </CardContent>

      <StatusDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        title="Create Status"
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
                description: selectedStatus.description,
                statusType: "",
                status: selectedStatus.status,
              }
            : undefined
        }
        title="Edit Status"
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
