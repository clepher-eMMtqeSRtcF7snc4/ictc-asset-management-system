"use client";

import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PermissionModule } from "./permission-module";
import { PermissionResourceRow } from "./permission-resource-row";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MODULE_EMOJIS: Record<string, string> = {
  Users: "👥",
  "Roles & Permissions": "🛡️",
  Assets: "💻",
  Inventory: "📦",
  Procurement: "🛒",
  Reports: "📊",
  "System Settings": "⚙️",
  "Audit Logs": "📝",
  Departments: "🏢",
  Employees: "👷",
  Locations: "📍",
  Categories: "📂",
  Suppliers: "🏢",
};

interface PermissionMatrixProps {
  groupedPermissions: Record<string, Record<string, any[]>>;
  moduleNames: string[];
  columns: string[];
  expandedModules: Set<string>;
  selectedPermissions: Set<string>;
  onTogglePermission: (permissionId: string) => void;
  onSelectModule: (module: string) => void;
  onToggleModule: (module: string) => void;
  moduleSelected: (moduleName: string) => boolean;
  moduleIndeterminate: (moduleName: string) => boolean;
  moduleAssignedCount: (moduleName: string) => number;
}

export function PermissionMatrix({
  groupedPermissions,
  moduleNames,
  columns,
  expandedModules,
  selectedPermissions,
  onTogglePermission,
  onSelectModule,
  onToggleModule,
  moduleSelected,
  moduleIndeterminate,
  moduleAssignedCount,
}: PermissionMatrixProps) {
  const getModulePermissionCount = (moduleName: string) => {
    const resourceMap = groupedPermissions[moduleName] || {};
    return Object.values(resourceMap).flat().length;
  };

  if (moduleNames.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="font-medium">No permissions available</p>
        <p className="mt-1 text-sm text-muted-foreground">
          There are currently no permissions configured in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {moduleNames.map((moduleName) => {
        const resourceMap = groupedPermissions[moduleName] || {};
        const resources = Object.entries(resourceMap);
        const emoji = MODULE_EMOJIS[moduleName] ?? "📁";
        const isOpen = expandedModules.has(moduleName);

        return (
          <Collapsible
            key={moduleName}
            open={isOpen}
            onOpenChange={() => onToggleModule(moduleName)}
            className="border rounded-lg"
          >
            <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-left"
                    aria-expanded={isOpen}
                  >
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isOpen ? "" : "-rotate-90"
                      }`}
                    />
                    <span className="text-lg font-semibold">
                      {emoji} {moduleName}
                    </span>
                  </button>
                </CollapsibleTrigger>
                <span className="text-xs text-muted-foreground">
                  {moduleAssignedCount(moduleName)} of{" "}
                  {getModulePermissionCount(moduleName)} selected
                </span>
              </div>

              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectModule(moduleName);
                }}
              >
                <PermissionModule
                  moduleName={moduleName}
                  moduleSelected={moduleSelected(moduleName)}
                  moduleIndeterminate={moduleIndeterminate(moduleName)}
                  onSelect={() => onSelectModule(moduleName)}
                />
              </div>
            </div>

            <CollapsibleContent>
              <div className="px-4 py-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Resource</TableHead>
                      {columns.map((col) => (
                        <TableHead
                          key={col}
                          className="text-center capitalize"
                        >
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map(([resourceName, perms]) => (
                      <PermissionResourceRow
                        key={`${moduleName}-${resourceName}`}
                        resourceName={resourceName}
                        permissions={perms}
                        columns={columns}
                        selectedPermissions={selectedPermissions}
                        onTogglePermission={onTogglePermission}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
