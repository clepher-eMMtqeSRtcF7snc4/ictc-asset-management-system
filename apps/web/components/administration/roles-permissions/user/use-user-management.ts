"use client";

import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";

export function useUserManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | string>("all");
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [manageRolesOpen, setManageRolesOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const utils = trpc.useUtils();

  const usersQuery = trpc.rbacRouter.getUsers.useQuery(
    {
      search: search || undefined,
      status: status === "all" ? undefined : (status as any),
      roleId,
      page,
      pageSize: 10,
    },
    { placeholderData: keepPreviousData }
  );

  const assignRole = trpc.rbacRouter.assignRoleToUser.useMutation({
    onSuccess: () => {
      utils.rbacRouter.getUsers.invalidate();
      toast.success("Role assigned successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to assign role.");
    },
  });

  const removeRole = trpc.rbacRouter.removeRoleFromUser.useMutation({
    onSuccess: () => {
      utils.rbacRouter.getUsers.invalidate();
      toast.success("Role removed successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to remove role.");
    },
  });

  const handleManageRoles = (user: any) => {
    setSelectedUser(user);
    setManageRolesOpen(true);
  };

  const handleRemoveAccess = (user: any) => {
    if (confirm(`Are you sure you want to remove access for "${user.name}"?`)) {
      toast.info("User access removal not yet implemented.");
    }
  };

  const handleAssignRole = (roleId: string) => {
    if (selectedUser?.id) {
      assignRole.mutate({ userId: selectedUser.id, roleId });
    }
  };

  const handleRemoveRole = (roleId: string) => {
    if (selectedUser?.id) {
      removeRole.mutate({ userId: selectedUser.id, roleId });
    }
  };

  return {
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    roleId,
    setRoleId,
    manageRolesOpen,
    setManageRolesOpen,
    selectedUser,
    setSelectedUser,
    usersQuery,
    assignRole,
    removeRole,
    handleManageRoles,
    handleRemoveAccess,
    handleAssignRole,
    handleRemoveRole,
  };
}
