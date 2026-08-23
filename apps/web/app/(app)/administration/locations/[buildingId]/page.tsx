"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { RoomFilters } from "@/components/administration/locations/room/room-filters";
import { RoomDeleteDialog } from "@/components/administration/locations/room/room-delete-dialog";
import { RoomDialog } from "@/components/administration/locations/room/room-dialog";
import { RoomTable } from "@/components/administration/locations/room/room-table";
import { RoomTypeTable } from "@/components/administration/locations/room-type/room-type-table";
import { RoomTypeDialog } from "@/components/administration/locations/room-type/room-type-dialog";
import { RoomTypeDeleteDialog } from "@/components/administration/locations/room-type/room-type-delete-dialog";
import { RoomTypeFilters } from "@/components/administration/locations/room-type/room-type-filters";
import { PageHeader } from "@/components/layout/page-header";
import { DUMMY_ROOMS, DUMMY_ROOM_TYPES, Room, RoomType, CreateRoomInput, CreateRoomTypeInput } from "@repo/trpc/schemas";
import { toast } from "sonner";

const DEFAULT_PAGE_SIZE = 10;

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [createError, setCreateError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [floor, setFloor] = useState("all");
  const [rooms, setRooms] = useState<Room[]>(DUMMY_ROOMS);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>(DUMMY_ROOM_TYPES);
  const [roomTypeSearch, setRoomTypeSearch] = useState("");
  const [roomTypePage, setRoomTypePage] = useState(1);
  const [roomTypeCreateOpen, setRoomTypeCreateOpen] = useState(false);
  const [roomTypeEditOpen, setRoomTypeEditOpen] = useState(false);
  const [roomTypeDeleteOpen, setRoomTypeDeleteOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [roomTypeCreateError, setRoomTypeCreateError] = useState<string | null>(null);

  const buildingId = params.buildingId;
  const name = searchParams.get("name");
  const description = searchParams.get("desc");

  const displayName = name ?? "Building";
  const displayDescription = description ?? "Manage rooms within this building.";

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesBuilding = room.buildingId === Number(buildingId);
      const matchesSearch =
        !search ||
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.code?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || room.status === status;
      const matchesFloor = floor === "all" || room.floor === floor;
      return matchesBuilding && matchesSearch && matchesStatus && matchesFloor;
    });
  }, [rooms, buildingId, search, status, floor]);

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / DEFAULT_PAGE_SIZE));
  const paginatedRooms = filteredRooms.slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE);

  const filteredRoomTypes = useMemo(() => {
    return roomTypes.filter((roomType) => {
      const matchesSearch =
        !roomTypeSearch ||
        roomType.name.toLowerCase().includes(roomTypeSearch.toLowerCase()) ||
        roomType.code?.toLowerCase().includes(roomTypeSearch.toLowerCase());
      return matchesSearch;
    });
  }, [roomTypes, roomTypeSearch]);

  const roomTypeTotalPages = Math.max(1, Math.ceil(filteredRoomTypes.length / DEFAULT_PAGE_SIZE));
  const paginatedRoomTypes = filteredRoomTypes.slice((roomTypePage - 1) * DEFAULT_PAGE_SIZE, roomTypePage * DEFAULT_PAGE_SIZE);

  const handleCreate = (values: CreateRoomInput) => {
    const newRoom: Room = {
      id: rooms.length + 1,
      ...values,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRooms((prev) => [...prev, newRoom]);
    setCreateError(null);
    setCreateOpen(false);
    toast.success("Room created successfully.");
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setEditOpen(true);
  };

  const handleUpdate = (values: CreateRoomInput) => {
    if (!selectedRoom) return;
    setRooms((prev) =>
      prev.map((r) =>
        r.id === selectedRoom.id ? { ...r, ...values, updatedAt: new Date() } : r
      )
    );
    setEditOpen(false);
    setSelectedRoom(null);
    toast.success("Room updated successfully.");
  };

  const handleDeleteClick = (room: Room) => {
    setSelectedRoom(room);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedRoom) return;
    setRooms((prev) => prev.filter((r) => r.id !== selectedRoom.id));
    setDeleteOpen(false);
    setSelectedRoom(null);
    toast.success("Room deleted successfully.");
  };

  const handleRoomTypeCreate = (values: CreateRoomTypeInput) => {
    const newRoomType: RoomType = {
      id: roomTypes.length + 1,
      ...values,
    };
    setRoomTypes((prev) => [...prev, newRoomType]);
    setRoomTypeCreateError(null);
    setRoomTypeCreateOpen(false);
    toast.success("Room type created successfully.");
  };

  const handleRoomTypeEdit = (roomType: RoomType) => {
    setSelectedRoomType(roomType);
    setRoomTypeEditOpen(true);
  };

  const handleRoomTypeUpdate = (values: CreateRoomTypeInput) => {
    if (!selectedRoomType) return;
    setRoomTypes((prev) =>
      prev.map((rt) =>
        rt.id === selectedRoomType.id ? { ...rt, ...values } : rt
      )
    );
    setRoomTypeEditOpen(false);
    setSelectedRoomType(null);
    toast.success("Room type updated successfully.");
  };

  const handleRoomTypeDeleteClick = (roomType: RoomType) => {
    setSelectedRoomType(roomType);
    setRoomTypeDeleteOpen(true);
  };

  const handleRoomTypeDeleteConfirm = () => {
    if (!selectedRoomType) return;
    setRoomTypes((prev) => prev.filter((rt) => rt.id !== selectedRoomType.id));
    setRoomTypeDeleteOpen(false);
    setSelectedRoomType(null);
    toast.success("Room type deleted successfully.");
  };

  return (
    <div className="space-y-6">
      <div>
        <PageHeader
          title={displayName}
          description={displayDescription}
          action={
            <Link
              className="flex gap-1.5 text-primary text-sm font-semibold"
              href="/administration/locations"
            >
              <ArrowLeft width="20" height="20" /> Back to locations
            </Link>
          }
        ></PageHeader>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Rooms</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure rooms, offices, departments, and storage areas.
            </p>
          </div>
          <div>
            <Button className="ml-1.5" onClick={() => {
              setCreateError(null);
              setCreateOpen(true);
            }}>
              <Plus /> Create Room
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
          <RoomFilters
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
            floor={floor}
            onFloorChange={(value) => {
              setFloor(value);
              setPage(1);
            }}
          />
          <RoomTable
            data={paginatedRooms}
            page={page}
            pageSize={DEFAULT_PAGE_SIZE}
            totalPages={totalPages}
            onPaginationChange={({ page: newPage, pageSize }) => {
              setPage(newPage);
            }}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Room Types</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage categories and classifications for rooms.
            </p>
          </div>
          <div>
            <Button className="ml-1.5" onClick={() => {
              setRoomTypeCreateError(null);
              setRoomTypeCreateOpen(true);
            }}>
              <Plus /> Create Room Type
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
          <RoomTypeFilters
            search={roomTypeSearch}
            onSearchChange={(value) => {
              setRoomTypeSearch(value);
              setRoomTypePage(1);
            }}
          />
          <RoomTypeTable
            data={paginatedRoomTypes}
            page={roomTypePage}
            pageSize={DEFAULT_PAGE_SIZE}
            totalPages={roomTypeTotalPages}
            onPaginationChange={({ page: newPage, pageSize }) => {
              setRoomTypePage(newPage);
            }}
            onEdit={handleRoomTypeEdit}
            onDelete={handleRoomTypeDeleteClick}
          />
        </CardContent>
      </Card>

      <RoomDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        errorMessage={createError}
        onClearError={() => setCreateError(null)}
        title="Create Room"
      />

      <RoomDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        defaultValues={selectedRoom ?? undefined}
        title="Edit Room"
      />

      <RoomDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        roomName={selectedRoom?.name ?? ""}
      />

      <RoomTypeDialog
        open={roomTypeCreateOpen}
        onOpenChange={setRoomTypeCreateOpen}
        onSubmit={handleRoomTypeCreate}
        errorMessage={roomTypeCreateError}
        onClearError={() => setRoomTypeCreateError(null)}
        title="Create Room Type"
      />

      <RoomTypeDialog
        open={roomTypeEditOpen}
        onOpenChange={setRoomTypeEditOpen}
        onSubmit={handleRoomTypeUpdate}
        defaultValues={selectedRoomType ?? undefined}
        title="Edit Room Type"
      />

      <RoomTypeDeleteDialog
        open={roomTypeDeleteOpen}
        onOpenChange={setRoomTypeDeleteOpen}
        onConfirm={handleRoomTypeDeleteConfirm}
        roomTypeName={selectedRoomType?.name ?? ""}
      />
    </div>
  );
}
