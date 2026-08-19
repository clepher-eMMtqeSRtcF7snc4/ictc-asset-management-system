"use client";

import { useState } from "react";
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
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const buildingsQuery = trpc.buildingRouter.getBuildings.useQuery(
    {
      search: search || undefined,
      status: status === "all" ? undefined : (status as "active" | "inactive"),
      page,
      pageSize,
    },
    { placeholderData: keepPreviousData },
  );

  const buildings = buildingsQuery.data?.items ?? [];
  const totalPages = buildingsQuery.data?.totalPages ?? 1;

  const utils = trpc.useUtils();
  const createBuilding = trpc.buildingRouter.create.useMutation({
    onSuccess: () => {
      utils.buildingRouter.getBuildings.invalidate();
      setCreateOpen(false);
      toast.success("Building created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create building.");
    },
  });

  const handleCreate = (values: CreateBuildingInput) => {
    createBuilding.mutate(values);
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
          <Button onClick={() => setCreateOpen(true)}>
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
              setSelectedBuilding(building);
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
          title="Create Building"
        />

        <BuildingDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          onSubmit={() => {
            setEditOpen(false);
            setSelectedBuilding(null);
            toast.info("Building updates are not yet supported.");
          }}
          defaultValues={
            selectedBuilding
              ? {
                  code: selectedBuilding.code,
                  name: selectedBuilding.name,
                  description: selectedBuilding.description,
                  status: selectedBuilding.status,
                }
              : undefined
          }
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
