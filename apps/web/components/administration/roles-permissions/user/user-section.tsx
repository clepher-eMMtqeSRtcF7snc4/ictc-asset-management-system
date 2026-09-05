"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserTable } from "./user-table";
import { UserDeleteDialog } from "./user-delete-dialog";
import { UserDialog } from "./user-dialog";
import { useUserManagement } from "./use-user-management";

export function UserSection() {
  const {
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    departmentId,
    setDepartmentId,
    departments,
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

  const handleDepartmentChange = (value: string) => {
    setDepartmentId(value ? Number(value) : undefined);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setDepartmentId(undefined);
  };

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

      <div className="px-6 pb-4 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            type="text"
            placeholder="Search users..."
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
          <Select
            value={departmentId?.toString() ?? "all"}
            onValueChange={handleDepartmentChange}
            disabled={departments.length === 0}
          >
            <SelectTrigger className="h-9 w-52">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(search || status !== "all" || departmentId !== undefined) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

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
