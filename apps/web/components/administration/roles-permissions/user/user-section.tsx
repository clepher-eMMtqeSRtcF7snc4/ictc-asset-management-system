"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserTable } from "./user-table";
import { UserDeleteDialog } from "./user-delete-dialog";
import { UserDialog } from "./user-dialog";
import { useUserManagement } from "./use-user-management";

export function UserSection() {
  const {
    page,
    setPage,
    deleteOpen,
    setDeleteOpen,
    createOpen,
    setCreateOpen,
    selectedUser,
    usersQuery,
    currentUserQuery,
    isAdmin,
    createUser,
    handleManageRoles,
    handleRemoveAccess,
    handleConfirmRemoveAccess,
    handleCreateUser,
  } = useUserManagement();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Users</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage user roles and permissions.
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setCreateOpen(true)}>Create User</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto">
        {usersQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <UserTable
            data={usersQuery.data?.data ?? []}
            page={usersQuery.data?.page ?? 1}
            pageSize={usersQuery.data?.pageSize ?? 10}
            totalPages={Math.ceil((usersQuery.data?.total ?? 0) / (usersQuery.data?.pageSize ?? 10))}
            onPaginationChange={(next) => setPage(next.page)}
            onEdit={handleManageRoles}
            onDelete={handleRemoveAccess}
          />
        )}
      </CardContent>

      <UserDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmRemoveAccess}
        userName={selectedUser?.name ?? ""}
      />

      {isAdmin && (
        <UserDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreateUser}
          isPending={createUser.isPending}
        />
      )}
    </Card>
  );
}
