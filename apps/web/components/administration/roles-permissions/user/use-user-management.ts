"use client";

import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { UserFormData } from "@/lib/auth/schema";

export function useUserManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | string>("all");
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [manageRolesOpen, setManageRolesOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const utils = trpc.useUtils();

  const usersQuery = trpc.userRbacRouter.getUsers.useQuery(
    {
      search: search || undefined,
      status: status === "all" ? undefined : (status as any),
      roleId,
      page,
      pageSize: 10,
    },
    { placeholderData: keepPreviousData }
  );

  const currentUserQuery = trpc.userRbacRouter.getCurrentUser.useQuery({});

  const assignRole = trpc.userRbacRouter.assignRoleToUser.useMutation({
    onSuccess: () => {
      utils.userRbacRouter.getUsers.invalidate();
      toast.success("Role assigned successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to assign role.");
    },
  });

  const removeRole = trpc.userRbacRouter.removeRoleFromUser.useMutation({
    onSuccess: () => {
      utils.userRbacRouter.getUsers.invalidate();
      toast.success("Role removed successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to remove role.");
    },
  });

  const createUser = trpc.userRbacRouter.createUser.useMutation({
    onSuccess: () => {
      utils.userRbacRouter.getUsers.invalidate();
      setCreateOpen(false);
      setSelectedUser(null);
      toast.success("User created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create user.");
    },
  });

  const handleManageRoles = (user: any) => {
    setSelectedUser(user);
    setManageRolesOpen(true);
  };

  const handleRemoveAccess = (user: any) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleConfirmRemoveAccess = () => {
    if (selectedUser?.id) {
      setDeleteOpen(false);
      setSelectedUser(null);
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

  const handleCreateUser = (data: UserFormData) => {
    createUser.mutate(data);
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
    deleteOpen,
    setDeleteOpen,
    createOpen,
    setCreateOpen,
    selectedUser,
    setSelectedUser,
    usersQuery,
    currentUserQuery,
    isAdmin: currentUserQuery.data?.isAdmin ?? false,
    createUser,
    handleManageRoles,
    handleRemoveAccess,
    handleConfirmRemoveAccess,
    handleAssignRole,
    handleRemoveRole,
    handleCreateUser,
  };
}
