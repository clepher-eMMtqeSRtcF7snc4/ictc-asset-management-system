"use client";

import { useRouter } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { RoleSummary } from "./role-summary";
import { PermissionToolbar } from "./permission-toolbar";
import { PermissionMatrix } from "./permission-matrix";
import { PermissionSaveBar } from "./permission-save-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PermissionManagementSectionProps {
  roleId: string;
}

export function PermissionManagementSection({
  roleId,
}: PermissionManagementSectionProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(),
  );
  const [originalAssigned, setOriginalAssigned] = useState<Set<string>>(
    new Set(),
  );

  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(),
  );
  const [expandAll, setExpandAll] = useState(true);
  const [moduleFilter, setModuleFilter] = useState<string>("All Modules");
  const [search, setSearch] = useState("");

  const roleQuery = trpc.roleRouter.getRoleById.useQuery(
    { id: roleId },
    {
      enabled: !!roleId,
      placeholderData: keepPreviousData,
    },
  );

  const allPermissionsQuery = trpc.permissionRouter.getPermissions.useQuery(
    { page: 1, pageSize: 500 },
    { placeholderData: keepPreviousData },
  );

  const rolePermissionsQuery = trpc.roleRouter.getRolePermissions.useQuery(
    { id: roleId },
    {
      enabled: !!roleId,
      placeholderData: keepPreviousData,
    },
  );

  const syncRolePermissions = trpc.roleRouter.syncRolePermissions.useMutation({
    onSuccess: () => {
      utils.roleRouter.getRoles.invalidate();
      utils.roleRouter.getRolePermissions.invalidate();
      toast.success("Role permissions updated successfully.");
      router.push("/administration/roles-permissions");
    },
    onError: (error: any) => {
      if (error?.data?.code === "UNAUTHORIZED") {
        toast.error(
          "You do not have permission to manage role permissions.",
        );
      } else {
        toast.error(error.message ?? "Failed to update permissions.");
      }
    },
  });

  const allPermissions = allPermissionsQuery.data?.data ?? [];

  useEffect(() => {
    const assignedIds = new Set(
      (rolePermissionsQuery.data ?? []).map((p: any) => p.id),
    );
    setSelectedPermissions(new Set(assignedIds));
    setOriginalAssigned(new Set(assignedIds));
  }, [rolePermissionsQuery.data, roleId]);

  useEffect(() => {
    const modulesFromData = new Set(
      allPermissions.map((p: any) => p.module || "Other"),
    );
    if (expandAll) {
      setExpandedModules(modulesFromData);
    }
  }, [expandAll, allPermissions]);

  const availableModules = useMemo(() => {
    const mods = allPermissions
      .map((p: any) => p.module || "Other")
      .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
      .sort();
    return ["All Modules", ...mods];
  }, [allPermissions]);

  const filteredPermissions = useMemo(() => {
    let result = allPermissions;

    const searchLower = search.toLowerCase();
    if (searchLower.trim()) {
      result = result.filter(
        (p: any) =>
          p.code?.toLowerCase().includes(searchLower) ||
          p.name?.toLowerCase().includes(searchLower) ||
          p.module?.toLowerCase().includes(searchLower) ||
          p.action?.toLowerCase().includes(searchLower),
      );
    }

    if (moduleFilter !== "All Modules") {
      result = result.filter(
        (p: any) => (p.module || "Other") === moduleFilter,
      );
    }

    return result;
  }, [allPermissions, search, moduleFilter]);

  const columns = useMemo(() => {
    const cols = new Set<string>();
    filteredPermissions.forEach((p: any) => cols.add(p.action));
    return Array.from(cols).sort();
  }, [filteredPermissions]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Record<string, any[]>> = {};
    filteredPermissions.forEach((p: any) => {
      const moduleName = p.module || "Other";
      if (!groups[moduleName]) groups[moduleName] = {};
      const resource = p.code || p.name || p.action || "General";
      if (!groups[moduleName][resource]) groups[moduleName][resource] = [];
      groups[moduleName][resource].push(p);
    });
    return groups;
  }, [filteredPermissions]);

  const moduleNames = useMemo(
    () => Object.keys(groupedPermissions),
    [groupedPermissions],
  );

  const totalPermissions = filteredPermissions.length;

  const assignedCount = useMemo(() => {
    return filteredPermissions.filter((p: any) =>
      selectedPermissions.has(p.id),
    ).length;
  }, [filteredPermissions, selectedPermissions]);

  const isAllSelected =
    totalPermissions > 0 && assignedCount === totalPermissions;

  const isIndeterminate = assignedCount > 0 && !isAllSelected;

  // Module-level: is the *visible* (filtered) set for a module fully selected?
  const moduleSelected = (moduleName: string) => {
    const resourceMap = groupedPermissions[moduleName] || {};
    const ids = Object.values(resourceMap).flat().map((p: any) => p.id);
    return ids.length > 0 && ids.every((id) => selectedPermissions.has(id));
  };

  const moduleIndeterminate = (moduleName: string) => {
    const resourceMap = groupedPermissions[moduleName] || {};
    const ids = Object.values(resourceMap).flat().map((p: any) => p.id);
    return (
      ids.some((id) => selectedPermissions.has(id)) &&
      !moduleSelected(moduleName)
    );
  };

  const moduleAssignedCount = (moduleName: string) => {
    const resourceMap = groupedPermissions[moduleName] || {};
    const ids = Object.values(resourceMap).flat().map((p: any) => p.id);
    return ids.filter((id) => selectedPermissions.has(id)).length;
  };

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) {
        next.delete(permissionId);
      } else {
        next.add(permissionId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPermissions(new Set());
    } else {
      const allAvailable = filteredPermissions.map((p: any) => p.id);
      setSelectedPermissions(new Set(allAvailable));
    }
  };

  const handleSelectModule = (moduleName: string) => {
    const resourceMap = groupedPermissions[moduleName] || {};
    const ids = Object.values(resourceMap).flat().map((p: any) => p.id);
    if (ids.length === 0) return;

    const allSelected = ids.every((id) => selectedPermissions.has(id));
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleModule = (moduleName: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleName)) {
        next.delete(moduleName);
      } else {
        next.add(moduleName);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandAll(true);
    setExpandedModules(new Set(moduleNames));
  };

  const handleCollapseAll = () => {
    setExpandAll(false);
    setExpandedModules(new Set());
  };

  const handleSave = () => {
    if (!roleId) return;
    syncRolePermissions.mutate({
      id: roleId,
      permissionIds: Array.from(selectedPermissions),
    });
  };

  const handleCancel = () => {
    router.push("/administration/roles-permissions");
  };

  const handleDiscard = () => {
    setSelectedPermissions(new Set(originalAssigned));
  };

  const hasChanges =
    selectedPermissions.size !== originalAssigned.size ||
    Array.from(selectedPermissions).some(
      (id) => !originalAssigned.has(id),
    );

  const assignedTotal = Array.from(originalAssigned).length;

  // While the role metadata itself is loading, we still render the toolbar/matrix
  // skeleton so the layout doesn't shift. Only error if the role is required.
  const roleMissing = roleQuery.data === null || roleQuery.isError;

  if (roleMissing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">
          {roleQuery.isError
            ? "Failed to load role information."
            : "Role not found."}
        </p>
      </div>
    );
  }

  const permissionsLoading = allPermissionsQuery.isPending;
  const rolePermissionsLoading = rolePermissionsQuery.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <RoleSummary
            role={roleQuery.data ?? undefined}
            roleLoading={roleQuery.isPending}
            assignedCount={assignedCount}
            totalPermissions={allPermissions.length}
            assignedTotal={assignedTotal}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the permissions to assign to this role. Changes will take
            effect after saving.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <PermissionToolbar
            search={search}
            onSearchChange={setSearch}
            availableModules={availableModules}
            selectedModule={moduleFilter}
            onModuleChange={setModuleFilter}
            totalPermissions={totalPermissions}
            assignedCount={assignedCount}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            onSelectAll={handleSelectAll}
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
          />

          {permissionsLoading || rolePermissionsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-full animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          ) : moduleNames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="font-medium">No permissions available</p>
              <p className="mt-1 text-sm text-muted-foreground">
                There are currently no permissions configured in the system.
              </p>
            </div>
          ) : (
            <PermissionMatrix
              groupedPermissions={groupedPermissions}
              moduleNames={moduleNames}
              columns={columns}
              expandedModules={expandedModules}
              selectedPermissions={selectedPermissions}
              onTogglePermission={handleTogglePermission}
              onSelectModule={handleSelectModule}
              onToggleModule={toggleModule}
              moduleSelected={moduleSelected}
              moduleIndeterminate={moduleIndeterminate}
              moduleAssignedCount={moduleAssignedCount}
            />
          )}
        </CardContent>
      </Card>

      <PermissionSaveBar
        hasChanges={hasChanges}
        isSaving={syncRolePermissions.isPending}
        assignedCount={assignedCount}
        onSave={handleSave}
        onCancel={handleCancel}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
