"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Room } from "@/components/administration/master-data/types";
import { mockRooms } from "@/components/administration/master-data/mock-data";
import { BuildingFilters } from "@/components/administration/locations/buidling/building-filters";
import { RoomsTable } from "@/components/administration/locations/buidling/building-table";
import { BuildingDialog } from "@/components/administration/locations/buidling/building-dialog";
import { BuildingDeleteDialog } from "@/components/administration/locations/buidling/building-delete-dialog";
import { Building, CreateBuildingInput } from "@repo/trpc/schemas";
import { trpc } from "@/lib/trpc/client";


export default function Page() {
  const [rooms, setRooms] = useState<Building[]>(mockRooms);
  const [search, setSearch] = useState("");
  // const [building, setBuilding] = useState("all");
  // const [floor, setFloor] = useState("all");
  // const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const utils = trpc.useUtils(); 
  const createBuilding = trpc.buildingRouter.create.useMutation({})

  const filteredBuilding = useMemo(() => {
    return rooms.filter((building) => {
      const matchesSearch =
        !search ||
        building.name.toLowerCase().includes(search.toLowerCase()) ||
        building.code.toLowerCase().includes(search.toLowerCase());
      // const matchesBuilding = building === "all" || room.building === building;
      // const matchesFloor = floor === "all" || room.floor === floor;
      // const matchesDepartment = department === "all" || room.department === department;
      const matchesStatus = status === "all" || building.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [rooms, search, status]);

    const handleCreate = async (values: CreateBuildingInput) => {
      console.log(values)
      await createBuilding.mutateAsync(values)
      setCreateOpen(false);
      toast.success("Room created successfully.");
    };
  
    const handleEdit = (values: CreateBuildingInput) => {
      if (!selectedRoom) return;
      setRooms(
        rooms.map((r) =>
          r.id === selectedRoom.id
            ? {
                ...r,
                code: values.code,
                name: values.name,
                building: values.building,
                floor: values.floor,
                department: values.department,
                roomType: values.roomType,
                custodian: values.custodian || "",
                status: values.status,
              }
            : r
        )
      );
      setEditOpen(false);
      setSelectedRoom(null);
      toast.success("Room updated successfully.");
    };
  
    const handleDelete = () => {
      if (!selectedRoom) return;
      setRooms(rooms.filter((r) => r.id !== selectedRoom.id));
      setDeleteOpen(false);
      setSelectedRoom(null);
      toast.success("Room deleted successfully.");
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
                  onSearchChange={setSearch}
                  // building={building}
                  // onBuildingChange={setBuilding}
                  // floor={floor}
                  // onFloorChange={setFloor}
                  // department={department}
                  // onDepartmentChange={setDepartment}
                  status={status}
                  onStatusChange={setStatus}
                />
                <RoomsTable
                  data={filteredBuilding}
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
                onSubmit={handleEdit}
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
                title="Edit Room"
              />
        
              <BuildingDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
                roomName={selectedBuilding?.name ?? ""}
              />
            </Card>
        
    </div>
  );
}
