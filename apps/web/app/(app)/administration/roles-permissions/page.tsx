"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleSection } from "@/components/administration/roles-permissions/role/role-section";
import { PermissionSection } from "@/components/administration/roles-permissions/permission/permission-section";
import { UserSection } from "@/components/administration/roles-permissions/user/user-section";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground">
          Manage roles and permissions for system access control.
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList variant="line">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
         <TabsContent value="users" className="mt-4">
          <UserSection />
        </TabsContent>
        <TabsContent value="roles" className="mt-4">
          <RoleSection />
        </TabsContent>
        <TabsContent value="permissions" className="mt-4">
          <PermissionSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}