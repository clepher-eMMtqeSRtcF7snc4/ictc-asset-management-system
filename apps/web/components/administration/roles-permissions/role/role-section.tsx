"use client";

import { useRef, useEffect } from "react";
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
import { RoleTable } from "./role-table";
import { RoleDialog } from "./role-dialog";
import { RoleDeleteDialog } from "./role-delete-dialog";
import { useRoleManagement } from "./use-role-management";

export function RoleSection() {
  const {
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    selectedRole,
    setSelectedRole,
    rolesQuery,
    modules,
    createRole,
    updateRole,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    handleConfirmDeleteRole,
    handleEditRole,
  } = useRoleManagement();

  const debouncedSearchRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debouncedSearchRef.current) {
        clearTimeout(debouncedSearchRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debouncedSearchRef.current) {
      clearTimeout(debouncedSearchRef.current);
    }
    debouncedSearchRef.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 300);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Roles</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage user roles.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Create Role
        </Button>
      </CardHeader>

      <div className="px-6 pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            type="text"
            placeholder="Search roles..."
            defaultValue={search}
            onChange={handleSearchChange}
            className="h-9 w-64"
          />
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {(search || status !== "all") && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <CardContent className="space-y-4 overflow-y-auto">
        {rolesQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading roles...</p>
          </div>
        ) : (
          <RoleTable
            data={rolesQuery.data?.data ?? []}
            page={rolesQuery.data?.page ?? 1}
            pageSize={rolesQuery.data?.pageSize ?? 10}
            totalPages={Math.ceil((rolesQuery.data?.total ?? 0) / (rolesQuery.data?.pageSize ?? 10))}
            onPaginationChange={(next) => setPage(next.page)}
            onEdit={handleEditRole}
            onDelete={handleDeleteRole}
          />
        )}
      </CardContent>

      <RoleDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateRole}
        isPending={createRole.isPending}
        title="Create Role"
        modules={modules}
      />

      <RoleDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setSelectedRole(null);
        }}
        onSubmit={handleUpdateRole}
        defaultValues={selectedRole}
        isPending={updateRole.isPending}
        title="Edit Role"
        modules={modules}
      />

      <RoleDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDeleteRole}
        roleName={selectedRole?.name ?? ""}
      />
    </Card>
  );
}