"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { PermissionTable } from "./permission-table";
import { PermissionDialog } from "./permission-dialog";
import { PermissionDeleteDialog } from "./permission-delete-dialog";
import { usePermissionManagement } from "./use-permission-management";

export function PermissionSection() {
  const {
    page,
    setPage,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    selectedPermission,
    setSelectedPermission,
    permissionsQuery,
    modules,
    createPermission,
    updatePermission,
    handleCreatePermission,
    handleUpdatePermission,
    handleDeletePermission,
    handleConfirmDeletePermission,
    handleEditPermission,
  } = usePermissionManagement();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Permissions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage system permissions.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> Create Permission
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto">
        {permissionsQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading permissions...</p>
          </div>
        ) : (
          <PermissionTable
            data={permissionsQuery.data?.data ?? []}
            page={permissionsQuery.data?.page ?? 1}
            pageSize={permissionsQuery.data?.pageSize ?? 10}
            totalPages={Math.ceil((permissionsQuery.data?.total ?? 0) / (permissionsQuery.data?.pageSize ?? 10))}
            onPaginationChange={(next) => setPage(next.page)}
            onEdit={handleEditPermission}
            onDelete={handleDeletePermission}
          />
        )}
      </CardContent>

      <PermissionDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreatePermission}
        isPending={createPermission.isPending}
        title="Create Permission"
        modules={modules}
      />

      <PermissionDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setSelectedPermission(null);
        }}
        onSubmit={handleUpdatePermission}
        defaultValues={selectedPermission}
        isPending={updatePermission.isPending}
        title="Edit Permission"
        modules={modules}
      />

      <PermissionDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDeletePermission}
        permissionName={selectedPermission?.name ?? ""}
      />
    </Card>
  );
}
