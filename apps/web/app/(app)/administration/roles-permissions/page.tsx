"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleSection } from "@/components/administration/roles-permissions/role/role-section";
import { PermissionSection } from "@/components/administration/roles-permissions/permission/permission-section";
import { UserSection } from "@/components/administration/roles-permissions/user/user-section";
import { useAuthorization } from "@/hooks/use-authorization";
import { useMemo } from "react";

export default function Page() {
  const { can, isLoading } = useAuthorization();

  const canViewUsers = can("user.read");
  const canViewRoles = can("role.read");
  const canViewPermissions = can("permission.read");

  const defaultTab = useMemo(() => {
    if (canViewUsers) return "users";
    if (canViewRoles) return "roles";
    if (canViewPermissions) return "permissions";
    return "users";
  }, [canViewUsers, canViewRoles, canViewPermissions]);

  const hasAnyAccess = canViewUsers || canViewRoles || canViewPermissions;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Roles & Permissions</h2>
          <p className="text-sm text-muted-foreground">
            Loading authorization...
          </p>
        </div>
      </div>
    );
  }

  if (!hasAnyAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Roles & Permissions</h2>
          <p className="text-sm text-muted-foreground">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground">
          Manage roles and permissions for system access control.
        </p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList variant="line">
          {canViewUsers && <TabsTrigger value="users">Users</TabsTrigger>}
          {canViewRoles && <TabsTrigger value="roles">Roles</TabsTrigger>}
          {canViewPermissions && <TabsTrigger value="permissions">Permissions</TabsTrigger>}
        </TabsList>
        {canViewUsers && (
          <TabsContent value="users" className="mt-4">
            <UserSection />
          </TabsContent>
        )}
        {canViewRoles && (
          <TabsContent value="roles" className="mt-4">
            <RoleSection />
          </TabsContent>
        )}
        {canViewPermissions && (
          <TabsContent value="permissions" className="mt-4">
            <PermissionSection />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}