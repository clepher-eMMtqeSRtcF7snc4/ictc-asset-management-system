"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Undo } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RoomFilters } from "@/components/administration/locations/room/room-filters";
import { RoomDeleteDialog } from "@/components/administration/locations/room/room-delete-dialog";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { CreateRoomInput } from "@repo/trpc/schemas";
import { PageHeader } from "@/components/layout/page-header";
import { Span } from "next/dist/trace";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [createError, setCreateError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");

  const buildingId = params.buildingId;
  const name = searchParams.get("name");
  const description = searchParams.get("desc");

  const displayName = name ?? "Building";
  const displayDescription = description ?? "Manage offices and physical locations used by assets.";

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

  const handleCreate = (values: CreateRoomInput) => {
      setCreateError(null);
      createBuilding.mutate(values);
    };

  return (
    <div className="space-y-6">
      <div>
        <PageHeader
          title={displayName}
          description={displayDescription}
          action={ <Link className="flex gap-1.5 text-primary text-sm font-semibold" href="/administration/locations">
            <ArrowLeft width="20" height="20"/> Back to locations</Link>}
        >
        </PageHeader>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Room</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure rooms, offices, departments, and storage areas.
            </p>
          </div>
          <div>
            <Button className="ml-1.5" onClick={() => {
            setCreateError(null);
            setCreateOpen(true);
          }}>
              <Plus /> Create Rooms
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
          />
          
        </CardContent>

         {/* <OfficeDeleteDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            onSubmit={handleCreate}
            errorMessage={createError}
            onClearError={() => setCreateError(null)}
            title="Create Building"
          /> */}
      </Card>
    </div>
  );
}
