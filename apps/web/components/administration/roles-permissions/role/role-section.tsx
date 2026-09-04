"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { RoleTable } from "./role-table";
import { RoleDialog } from "./role-dialog";
import { RoleDeleteDialog } from "./role-delete-dialog";
import { useRoleManagement } from "./use-role-management";

export function RoleSection() {
  const {
    page,
    setPage,
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