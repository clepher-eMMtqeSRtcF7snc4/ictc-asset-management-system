import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Room } from "@repo/trpc/schemas";

export interface RoomOption {
  id: number;
  name: string;
}

export function roomColumns({
  roomTypes = [],
  departments = [],
}: {
  roomTypes?: RoomOption[];
  departments?: RoomOption[];
}): ColumnDef<Room>[] {
  const roomTypeMap: Record<number, string> = Object.fromEntries(
    roomTypes.map((type) => [type.id, type.name]),
  );
  const departmentMap: Record<number, string> = Object.fromEntries(
    departments.map((department) => [department.id, department.name]),
  );

  return [
    { accessorKey: "code", header: "Room Code", cell: ({ row }) => <span className="font-mono text-xs">{row.original.code || "—"}</span> },
    { accessorKey: "name", header: "Room Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "floor", header: "Floor", cell: ({ row }) => <span>{row.original.floor}</span> },
    {
      accessorKey: "roomTypeId",
      header: "Room Type",
      cell: ({ row }) => <span>{roomTypeMap[row.original.roomTypeId] || "—"}</span>,
    },
    {
      accessorKey: "departmentId",
      header: "Department",
      cell: ({ row }) => <span>{row.original.departmentId ? departmentMap[row.original.departmentId] || "—" : "—"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "active" ? "success" : "destructive"}>
          {row.original.status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <RowActions room={row.original} />,
    },
  ];
}

function RowActions({ room }: { room: Room }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-xs" variant="ghost" aria-label={`Actions for ${room.name}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye /> View
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
