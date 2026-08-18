"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Room } from "@/components/administration/master-data/types";
import { mockRooms } from "@/components/administration/master-data/mock-data";
import { RoomFilters } from "@/components/administration/locations/location-filters";
import { RoomsTable } from "@/components/administration/locations/location-table";
import { RoomDialog } from "@/components/administration/locations/location-dialog";
import { RoomDeleteDialog } from "@/components/administration/locations/location-delete-dialog";
import { CreateLocationInput } from "@repo/trpc/schemas";


export default function Page() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [search, setSearch] = useState("");
  const [building, setBuilding] = useState("all");
  const [floor, setFloor] = useState("all");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        !search ||
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.code.toLowerCase().includes(search.toLowerCase());
      const matchesBuilding = building === "all" || room.building === building;
      const matchesFloor = floor === "all" || room.floor === floor;
      const matchesDepartment = department === "all" || room.department === department;
      const matchesStatus = status === "all" || room.status === status;
      return matchesSearch && matchesBuilding && matchesFloor && matchesDepartment && matchesStatus;
    });
  }, [rooms, search, building, floor, department, status]);

    const handleCreate = (values: CreateLocationInput) => {
      console.log(values)
      setCreateOpen(false);
      toast.success("Room created successfully.");
    };
  
    const handleEdit = (values: CreateLocationInput) => {
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
                <RoomFilters
                  search={search}
                  onSearchChange={setSearch}
                  building={building}
                  onBuildingChange={setBuilding}
                  floor={floor}
                  onFloorChange={setFloor}
                  department={department}
                  onDepartmentChange={setDepartment}
                  status={status}
                  onStatusChange={setStatus}
                />
                <RoomsTable
                  data={filteredRooms}
                  onEdit={(room) => {
                    setSelectedRoom(room);
                    setEditOpen(true);
                  }}
                  onDelete={(room) => {
                    setSelectedRoom(room);
                    setDeleteOpen(true);
                  }}
                />
              </CardContent>
        
              <RoomDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onSubmit={handleCreate}
                title="Create Room"
              />
        
              <RoomDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                onSubmit={handleEdit}
                defaultValues={
                  selectedRoom
                    ? {
                        code: selectedRoom.code,
                        name: selectedRoom.name,
                        building: selectedRoom.building,
                        floor: selectedRoom.floor,
                        department: selectedRoom.department,
                        roomType: selectedRoom.roomType,
                        custodian: selectedRoom.custodian,
                        status: selectedRoom.status,
                      }
                    : undefined
                }
                title="Edit Room"
              />
        
              <RoomDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={handleDelete}
                roomName={selectedRoom?.name ?? ""}
              />
            </Card>
        
    </div>
  );
}
