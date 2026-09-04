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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any>(null);

  const utils = trpc.useUtils();

  const permissionsQuery = trpc.permissionRouter.getPermissions.useQuery(
    {
      search: search || undefined,
      module: module === "all" ? undefined : module,
      page,
      pageSize: 10,
    },
    { placeholderData: keepPreviousData }
  );

  const modulesQuery = trpc.permissionRouter.getModules.useQuery({});

  const modules = useMemo(() => modulesQuery.data ?? [], [modulesQuery.data]);

  const createPermission = trpc.permissionRouter.createPermission.useMutation({
    onSuccess: () => {
      utils.permissionRouter.getPermissions.invalidate();
      setCreateOpen(false);
      toast.success("Permission created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create permission.");
    },
  });

  const updatePermission = trpc.permissionRouter.updatePermission.useMutation({
    onSuccess: () => {
      utils.permissionRouter.getPermissions.invalidate();
      setEditOpen(false);
      setSelectedPermission(null);
      toast.success("Permission updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update permission.");
    },
  });

  const deletePermission = trpc.permissionRouter.deletePermission.useMutation({
    onSuccess: () => {
      utils.permissionRouter.getPermissions.invalidate();
      setDeleteOpen(false);
      setSelectedPermission(null);
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
    setSelectedPermission(permission);
    setDeleteOpen(true);
  };

  const handleConfirmDeletePermission = () => {
    if (selectedPermission?.id) {
      deletePermission.mutate({ id: selectedPermission.id });
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
    deleteOpen,
    setDeleteOpen,
    selectedPermission,
    setSelectedPermission,
    permissionsQuery,
    modules,
    createPermission,
    updatePermission,
    deletePermission,
    handleCreatePermission,
    handleUpdatePermission,
    handleDeletePermission,
    handleConfirmDeletePermission,
    handleEditPermission,
  };
}
