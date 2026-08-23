"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, UserPlus2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RoomDialog } from "@/components/administration/locations/room/room-dialog";
import { RoomTable } from "@/components/administration/locations/room/room-table";
import { PageHeader } from "@/components/layout/page-header";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { DepartmentFilters } from "@/components/administration/locations/department/department-filters";

const DEFAULT_PAGE_SIZE = 10;

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [createError, setCreateError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");


  const department = searchParams.get("dept");
  const description = searchParams.get("desc");

  const displayName = department ?? "—";
  const displayDescription = description ?? "—";

  const utils = trpc.useUtils();


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
            <CardTitle>
                Department Employees
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure employees that belong in the department.
            </p>
          </div>
          <div>
            <Button className="ml-1.5" onClick={() => {
              setCreateError(null);
              setCreateOpen(true);
            }}>
              <UserPlus2 /> Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
          <DepartmentFilters
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
          {false ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading rooms...</p>
            </div>
          ) : (
            <RoomTable
              data={[]}
              page={page}
              pageSize={DEFAULT_PAGE_SIZE}
              totalPages={10}
              onPaginationChange={({ page: newPage }) => {
                setPage(newPage);
              }}
              onEdit={()=>{}}
              onDelete={()=>{}}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
