"use client";

import { useMemo, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { BuildingFilters } from "@/components/administration/locations/buidling/building-filters";
import { BuildingTable } from "@/components/administration/locations/buidling/building-table";
import { BuildingDialog } from "@/components/administration/locations/buidling/building-dialog";
import { BuildingDeleteDialog } from "@/components/administration/locations/buidling/building-delete-dialog";
import { Building, CreateBuildingInput } from "@repo/trpc/schemas";
import { trpc } from "@/lib/trpc/client";

export default function Page() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const buildingsQuery = trpc.buildingRouter.getBuildings.useQuery(
    {
      search: search || undefined,
      status: status === "all" ? undefined : (status as "active" | "inactive"),
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData },
  );

  const editBuildingQuery = trpc.buildingRouter.getBuildingById.useQuery(
    { id: editId! },
    { enabled: editId !== null },
  );

  const buildings = buildingsQuery.data?.items ?? [];
  const totalPages = buildingsQuery.data?.totalPages ?? 1;

  const editDefaults = useMemo(() => {
    const building = editBuildingQuery.data;
    return building
      ? {
          code: building.code,
          name: building.name,
          description: building.description,
          status: building.status,
        }
      : undefined;
  }, [editBuildingQuery.data]);

  const utils = trpc.useUtils();
  const createBuilding = trpc.buildingRouter.create.useMutation({
    onSuccess: () => {
      utils.buildingRouter.getBuildings.invalidate();
      setCreateError(null);
      setCreateOpen(false);
      toast.success("Building created successfully.");
    },
    onError: (error) => {
      setCreateError(error.message ?? "Failed to create building.");
      toast.error(error.message ?? "Failed to create building.");
    },
  });

  const handleCreate = (values: CreateBuildingInput) => {
    setCreateError(null);
    createBuilding.mutate(values);
  };

  const updateBuilding = trpc.buildingRouter.update.useMutation({
    onSuccess: () => {
      utils.buildingRouter.getBuildings.invalidate();
      utils.buildingRouter.getBuildingById.invalidate();
      setEditOpen(false);
      setSelectedBuilding(null);
      toast.success("Building updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update building.");
    },
  });

  const handleUpdate = (values: CreateBuildingInput) => {
    if (editId === null) return;
    updateBuilding.mutate({ id: editId, ...values });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Locations</h2>
        <p className="text-sm text-muted-foreground">
          Configure departments, buildings, rooms, and storage areas.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Building</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage building and physical locations used by assets.
            </p>
          </div>
          <Button onClick={() => {
            setCreateError(null);
            setCreateOpen(true);
          }}>
            <Plus /> Create Building
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
          <BuildingFilters
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            status={status}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          />
          <BuildingTable
            data={buildings}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            onPaginationChange={(next) => {
              setPage(next.page);
              setPageSize(next.pageSize);
            }}
            onEdit={(building) => {
              setEditId(building.id);
              setEditOpen(true);
            }}
            onDelete={(building) => {
              setSelectedBuilding(building);
              setDeleteOpen(true);
            }}
          />
        </CardContent>

        <BuildingDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
          errorMessage={createError}
          onClearError={() => setCreateError(null)}
          title="Create Building"
        />

        <BuildingDialog
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) setEditId(null);
          }}
          onSubmit={handleUpdate}
          defaultValues={editDefaults}
          title="Edit Building"
        />

        <BuildingDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={() => {
            setDeleteOpen(false);
            setSelectedBuilding(null);
            toast.info("Building deletion is not yet supported.");
          }}
          roomName={selectedBuilding?.name ?? ""}
        />
      </Card>
    </div>
  );
}
