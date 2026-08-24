"use client";

import { useState, useMemo } from "react";
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
import { PositionTable } from "@/components/administration/employees-position/position-table";
import { PositionDialog } from "@/components/administration/employees-position/position-dialog";
import { PositionDeleteDialog } from "@/components/administration/employees-position/position-delete-dialog";
import { CreatePositionInput, Position } from "@repo/trpc/schemas";
import { trpc } from "@/lib/trpc/client";

interface PositionSectionProps {
  employeePositions: { position: string; status: string }[];
}

export function PositionSection({ employeePositions }: PositionSectionProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const positionsQuery = trpc.positionRouter.getPositions.useQuery(
    {
      search: search || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData }
  );

  const editPositionQuery = trpc.positionRouter.getPositionById.useQuery(
    { id: editId! },
    { enabled: editId !== null }
  );

  const positions = positionsQuery.data?.items ?? [];
  const totalPages = positionsQuery.data?.totalPages ?? 1;

  const derivedEmployeeCounts = useMemo(() => {
    const map = new Map<string, number>();
    employeePositions.forEach((emp) => {
      if (!emp.position) return;
      map.set(emp.position, (map.get(emp.position) || 0) + 1);
    });
    return map;
  }, [employeePositions]);

  const enrichedPositions = useMemo(() => {
    return positions.map((pos) => ({
      ...pos,
      employeeCount: derivedEmployeeCounts.get(pos.name) ?? pos.employeeCount,
    }));
  }, [positions, derivedEmployeeCounts]);

  const editDefaults = useMemo(() => {
    const pos = editPositionQuery.data;
    return pos
      ? {
          name: pos.name,
          status: pos.status,
        }
      : undefined;
  }, [editPositionQuery.data]);

  const utils = trpc.useUtils();

  const createPosition = trpc.positionRouter.create.useMutation({
    onSuccess: () => {
      utils.positionRouter.getPositions.invalidate();
      setCreateError(null);
      setCreateOpen(false);
      toast.success("Position created successfully.");
    },
    onError: (error) => {
      setCreateError(error.message ?? "Failed to create position.");
      toast.error(error.message ?? "Failed to create position.");
    },
  });

  const handleCreatePosition = (values: CreatePositionInput) => {
    setCreateError(null);
    createPosition.mutate(values);
  };

  const updatePosition = trpc.positionRouter.update.useMutation({
    onSuccess: () => {
      utils.positionRouter.getPositions.invalidate();
      utils.positionRouter.getPositionById.invalidate();
      setEditOpen(false);
      setEditId(null);
      setSelectedPosition(null);
      toast.success("Position updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update position.");
    },
  });

  const handleUpdatePosition = (values: CreatePositionInput) => {
    if (editId === null) return;
    updatePosition.mutate({ id: editId, ...values });
  };

  const deletePosition = trpc.positionRouter.delete.useMutation({
    onSuccess: () => {
      utils.positionRouter.getPositions.invalidate();
      setDeleteOpen(false);
      setSelectedPosition(null);
      toast.success("Position deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete position.");
    },
  });

  const handleDeletePosition = () => {
    if (selectedPosition === null) return;
    deletePosition.mutate({ id: selectedPosition.id });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Positions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage employee positions.
          </p>
        </div>
        <Button onClick={() => {
          setCreateError(null);
          setCreateOpen(true);
        }}>
          <Plus /> Create Position
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search positions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value as "all" | "active" | "inactive"); setPage(1); }}>
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
        {positionsQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading positions...</p>
          </div>
        ) : (
          <PositionTable
            data={enrichedPositions}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPaginationChange={(next) => {
              setPage(next.page);
              setPageSize(next.pageSize);
            }}
            onEdit={(pos) => {
              setEditId(pos.id);
              setEditOpen(true);
            }}
            onDelete={(pos) => {
              setSelectedPosition(pos);
              setDeleteOpen(true);
            }}
          />
        )}
      </CardContent>

      <PositionDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreatePosition}
        errorMessage={createError}
        onClearError={() => setCreateError(null)}
        title="Create Position"
      />

      <PositionDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditId(null);
        }}
        onSubmit={handleUpdatePosition}
        defaultValues={editDefaults}
        title="Edit Position"
      />

      <PositionDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeletePosition}
        positionName={selectedPosition?.name ?? ""}
      />
    </Card>
  );
}
