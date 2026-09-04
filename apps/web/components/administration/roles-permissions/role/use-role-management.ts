"use client";

import { useState, useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";

export function useRoleManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const utils = trpc.useUtils();

  const rolesQuery = trpc.rbacRouter.getRoles.useQuery(
    {
      search: search || undefined,
      status: status === "all" ? undefined : (status as any),
      page,
      pageSize: 10,
    },
    { placeholderData: keepPreviousData }
  );

  const editRoleQuery = trpc.rbacRouter.getRoleById.useQuery(
    { id: selectedRole?.id || "" },
    { enabled: !!selectedRole?.id && editOpen }
  );

  const modulesQuery = trpc.rbacRouter.getModules.useQuery({});

  const modules = useMemo(() => modulesQuery.data ?? [], [modulesQuery.data]);

  const createRole = trpc.rbacRouter.createRole.useMutation({
    onSuccess: () => {
      utils.rbacRouter.getRoles.invalidate();
      setCreateOpen(false);
      toast.success("Role created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create role.");
    },
  });

  const updateRole = trpc.rbacRouter.updateRole.useMutation({
    onSuccess: () => {
      utils.rbacRouter.getRoles.invalidate();
      utils.rbacRouter.getRoleById.invalidate();
      setEditOpen(false);
      setSelectedRole(null);
      toast.success("Role updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update role.");
    },
  });

  const deleteRole = trpc.rbacRouter.deleteRole.useMutation({
    onSuccess: () => {
      utils.rbacRouter.getRoles.invalidate();
      toast.success("Role deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete role.");
    },
  });

  const handleCreateRole = (values: any) => {
    createRole.mutate(values);
  };

  const handleUpdateRole = (values: any) => {
    if (selectedRole?.id) {
      updateRole.mutate({ id: selectedRole.id, ...values });
    }
  };

  const handleDeleteRole = (role: any) => {
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      deleteRole.mutate({ id: role.id });
    }
  };

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setEditOpen(true);
  };

  return {
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
    selectedRole,
    setSelectedRole,
    rolesQuery,
    editRoleQuery,
    modules,
    createRole,
    updateRole,
    deleteRole,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    handleEditRole,
  };
}
