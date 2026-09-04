"use client";

import { useState, useMemo } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";

export function usePermissionManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [module, setModule] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any>(null);

  const utils = trpc.useUtils();

  const permissionsQuery = trpc.rbacRouter.getPermissions.useQuery(
    {
      search: search || undefined,
      module: module === "all" ? undefined : module,
      page,
      pageSize: 10,
    },
    { placeholderData: keepPreviousData }
  );

  const editPermissionQuery = trpc.rbacRouter.getPermissionById.useQuery(
    { id: selectedPermission?.id || "" },
    { enabled: !!selectedPermission?.id && editOpen }
  );

  const modulesQuery = trpc.rbacRouter.getModules.useQuery({});

  const modules = useMemo(() => modulesQuery.data ?? [], [modulesQuery.data]);

  const createPermission = trpc.rbacRouter.createPermission.useMutation({
    onSuccess: () => {
      utils.rbacRouter.getPermissions.invalidate();
      setCreateOpen(false);
      toast.success("Permission created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create permission.");
    },
  });

  const updatePermission = trpc.rbacRouter.updatePermission.useMutation({
    onSuccess: () => {
      utils.rbacRouter.getPermissions.invalidate();
      utils.rbacRouter.getPermissionById.invalidate();
      setEditOpen(false);
      setSelectedPermission(null);
      toast.success("Permission updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update permission.");
    },
  });

  const deletePermission = trpc.rbacRouter.deletePermission.useMutation({
    onSuccess: () => {
      utils.rbacRouter.getPermissions.invalidate();
      toast.success("Permission deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete permission.");
    },
  });

  const handleCreatePermission = (values: any) => {
    createPermission.mutate(values);
  };

  const handleUpdatePermission = (values: any) => {
    if (selectedPermission?.id) {
      updatePermission.mutate({ id: selectedPermission.id, ...values });
    }
  };

  const handleDeletePermission = (permission: any) => {
    if (confirm(`Are you sure you want to delete permission "${permission.name}"?`)) {
      deletePermission.mutate({ id: permission.id });
    }
  };

  const handleEditPermission = (permission: any) => {
    setSelectedPermission(permission);
    setEditOpen(true);
  };

  return {
    page,
    setPage,
    search,
    setSearch,
    module,
    setModule,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    selectedPermission,
    setSelectedPermission,
    permissionsQuery,
    editPermissionQuery,
    modules,
    createPermission,
    updatePermission,
    deletePermission,
    handleCreatePermission,
    handleUpdatePermission,
    handleDeletePermission,
    handleEditPermission,
  };
}
