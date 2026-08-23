"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RoomFilters } from "@/components/administration/locations/room/room-filters";
import { RoomDeleteDialog } from "@/components/administration/locations/room/room-delete-dialog";
import { RoomDialog } from "@/components/administration/locations/room/room-dialog";
import { RoomTable } from "@/components/administration/locations/room/room-table";
import { RoomTypeTable } from "@/components/administration/locations/room-type/room-type-table";
import { RoomTypeDialog } from "@/components/administration/locations/room-type/room-type-dialog";
import { RoomTypeDeleteDialog } from "@/components/administration/locations/room-type/room-type-delete-dialog";
import { RoomTypeFilters } from "@/components/administration/locations/room-type/room-type-filters";
import { PageHeader } from "@/components/layout/page-header";
import { trpc } from "@/lib/trpc/client";
import { CreateRoomInput, CreateRoomTypeInput, Room, RoomType } from "@repo/trpc/schemas";
import { toast } from "sonner";

const DEFAULT_PAGE_SIZE = 10;

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [createError, setCreateError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [floor, setFloor] = useState("all");

  const [roomTypeSearch, setRoomTypeSearch] = useState("");
  const [roomTypePage, setRoomTypePage] = useState(1);
  const [roomTypeCreateOpen, setRoomTypeCreateOpen] = useState(false);
  const [roomTypeEditOpen, setRoomTypeEditOpen] = useState(false);
  const [roomTypeDeleteOpen, setRoomTypeDeleteOpen] = useState(false);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null);
  const [roomTypeCreateError, setRoomTypeCreateError] = useState<string | null>(null);

  const buildingId = Number(params.buildingId);
  const name = searchParams.get("name");
  const description = searchParams.get("desc");

  const displayName = name ?? "Building";
  const displayDescription = description ?? "Manage rooms within this building.";

  const utils = trpc.useUtils();

  const roomsQuery = trpc.roomRouter.getRooms.useQuery({
    buildingId,
    search: search || undefined,
    status: status !== "all" ? status as "active" | "inactive" : undefined,
    floor: floor !== "all" ? floor as "1st floor" | "2nd floor" | "3rd floor" | "4th floor" : undefined,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const roomTypesQuery = trpc.roomTypeRouter.getRoomTypes.useQuery({
    search: roomTypeSearch || undefined,
    page: roomTypePage,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const createRoomMutation = trpc.roomRouter.create.useMutation({
    onSuccess: () => {
      utils.roomRouter.getRooms.invalidate();
      setCreateError(null);
      setCreateOpen(false);
      toast.success("Room created successfully.");
    },
    onError: (error) => {
      setCreateError(error.message ?? "Failed to create room.");
      toast.error(error.message ?? "Failed to create room.");
    },
  });

  const updateRoomMutation = trpc.roomRouter.update.useMutation({
    onSuccess: () => {
      utils.roomRouter.getRooms.invalidate();
      setEditOpen(false);
      setSelectedRoomId(null);
      toast.success("Room updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update room.");
    },
  });

  const deleteRoomMutation = trpc.roomRouter.delete.useMutation({
    onSuccess: () => {
      utils.roomRouter.getRooms.invalidate();
      setDeleteOpen(false);
      setSelectedRoomId(null);
      toast.success("Room deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete room.");
    },
  });

  const createRoomTypeMutation = trpc.roomTypeRouter.create.useMutation({
    onSuccess: () => {
      utils.roomTypeRouter.getRoomTypes.invalidate();
      setRoomTypeCreateError(null);
      setRoomTypeCreateOpen(false);
      toast.success("Room type created successfully.");
    },
    onError: (error) => {
      setRoomTypeCreateError(error.message ?? "Failed to create room type.");
      toast.error(error.message ?? "Failed to create room type.");
    },
  });

  const updateRoomTypeMutation = trpc.roomTypeRouter.update.useMutation({
    onSuccess: () => {
      utils.roomTypeRouter.getRoomTypes.invalidate();
      setRoomTypeEditOpen(false);
      setSelectedRoomTypeId(null);
      toast.success("Room type updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update room type.");
    },
  });

  const deleteRoomTypeMutation = trpc.roomTypeRouter.delete.useMutation({
    onSuccess: () => {
      utils.roomTypeRouter.getRoomTypes.invalidate();
      setRoomTypeDeleteOpen(false);
      setSelectedRoomTypeId(null);
      toast.success("Room type deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete room type.");
    },
  });

  const rooms = (roomsQuery.data?.items ?? []).map((r) => ({
    ...r,
    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
  })) as Room[];
  const roomTotalPages = roomsQuery.data?.totalPages ?? 1;
  const roomTypes = (roomTypesQuery.data?.items ?? []).map((rt) => ({
    ...rt,
  })) as RoomType[];
  const roomTypeTotalPages = roomTypesQuery.data?.totalPages ?? 1;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const selectedRoomType = roomTypes.find((rt) => rt.id === selectedRoomTypeId);

  const handleCreateRoom = (values: CreateRoomInput) => {
    setCreateError(null);
    createRoomMutation.mutate(values);
  };

  const handleEditRoom = (room: { id: number }) => {
    setSelectedRoomId(room.id);
    setEditOpen(true);
  };

  const handleUpdateRoom = (values: CreateRoomInput) => {
    if (!selectedRoomId) return;
    updateRoomMutation.mutate({ ...values, id: selectedRoomId } as any);
  };

  const handleDeleteRoomClick = (room: { id: number }) => {
    setSelectedRoomId(room.id);
    setDeleteOpen(true);
  };

  const handleDeleteRoomConfirm = () => {
    if (!selectedRoomId) return;
    deleteRoomMutation.mutate({ id: selectedRoomId });
  };

  const handleCreateRoomType = (values: CreateRoomTypeInput) => {
    setRoomTypeCreateError(null);
    createRoomTypeMutation.mutate(values);
  };

  const handleEditRoomType = (roomType: { id: number; name: string; code?: string | null }) => {
    setSelectedRoomTypeId(roomType.id);
    setRoomTypeEditOpen(true);
  };

  const handleUpdateRoomType = (values: CreateRoomTypeInput) => {
    if (!selectedRoomTypeId) return;
    updateRoomTypeMutation.mutate({ ...values, id: selectedRoomTypeId } as any);
  };

  const handleDeleteRoomTypeClick = (roomType: { id: number }) => {
    setSelectedRoomTypeId(roomType.id);
    setRoomTypeDeleteOpen(true);
  };

  const handleDeleteRoomTypeConfirm = () => {
    if (!selectedRoomTypeId) return;
    deleteRoomTypeMutation.mutate({ id: selectedRoomTypeId });
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
          {roomsQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading rooms...</p>
            </div>
          ) : (
            <RoomTable
              data={rooms}
              page={page}
              pageSize={DEFAULT_PAGE_SIZE}
              totalPages={roomTotalPages}
              onPaginationChange={({ page: newPage }) => {
                setPage(newPage);
              }}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoomClick}
            />
          )}
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
          {roomTypesQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading room types...</p>
            </div>
          ) : (
            <RoomTypeTable
              data={roomTypes}
              page={roomTypePage}
              pageSize={DEFAULT_PAGE_SIZE}
              totalPages={roomTypeTotalPages}
              onPaginationChange={({ page: newPage }) => {
                setRoomTypePage(newPage);
              }}
              onEdit={handleEditRoomType}
              onDelete={handleDeleteRoomTypeClick}
            />
          )}
        </CardContent>
      </Card>

      <RoomDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateRoom}
        errorMessage={createError}
        onClearError={() => setCreateError(null)}
        title="Create Room"
        defaultValues={{ buildingId, floor: "1st floor", roomTypeId: 1, name: "", departmentId: null }}
      />

      <RoomDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdateRoom}
        defaultValues={selectedRoom ? {
          name: selectedRoom.name,
          code: selectedRoom.code,
          roomTypeId: selectedRoom.roomTypeId,
          buildingId: selectedRoom.buildingId,
          floor: selectedRoom.floor,
          departmentId: selectedRoom.departmentId,
        } : undefined}
        title="Edit Room"
      />

      <RoomDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteRoomConfirm}
        roomName={selectedRoom?.name ?? ""}
      />

      <RoomTypeDialog
        open={roomTypeCreateOpen}
        onOpenChange={setRoomTypeCreateOpen}
        onSubmit={handleCreateRoomType}
        errorMessage={roomTypeCreateError}
        onClearError={() => setRoomTypeCreateError(null)}
        title="Create Room Type"
      />

      <RoomTypeDialog
        open={roomTypeEditOpen}
        onOpenChange={setRoomTypeEditOpen}
        onSubmit={handleUpdateRoomType}
        defaultValues={selectedRoomType ? {
          name: selectedRoomType.name,
          code: selectedRoomType.code,
        } : undefined}
        title="Edit Room Type"
      />

      <RoomTypeDeleteDialog
        open={roomTypeDeleteOpen}
        onOpenChange={setRoomTypeDeleteOpen}
        onConfirm={handleDeleteRoomTypeConfirm}
        roomTypeName={selectedRoomType?.name ?? ""}
      />
    </div>
  );
}
