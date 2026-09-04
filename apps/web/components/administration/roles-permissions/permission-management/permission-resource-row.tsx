"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TableCell, TableRow } from "@/components/ui/table";

interface PermissionResourceRowProps {
  resourceName: string;
  permissions: Array<{ id: string; name: string; action: string }>;
  columns: string[];
  selectedPermissions: Set<string>;
  onTogglePermission: (permissionId: string) => void;
}

export function PermissionResourceRow({
  resourceName,
  permissions,
  columns,
  selectedPermissions,
  onTogglePermission,
}: PermissionResourceRowProps) {
  const resourcePermissionIds = permissions.map((p) => p.id);
  const resourceSelected =
    resourcePermissionIds.length > 0 &&
    resourcePermissionIds.every((id) => selectedPermissions.has(id));
  const resourceIndeterminate =
    resourcePermissionIds.some((id) => selectedPermissions.has(id)) &&
    !resourceSelected;

  const handleResourceToggle = () => {
    const toggleSelect = !resourceSelected;
    resourcePermissionIds.forEach((id) => {
      const isSelected = selectedPermissions.has(id);
      if (toggleSelect && !isSelected) {
        onTogglePermission(id);
      } else if (!toggleSelect && isSelected) {
        onTogglePermission(id);
      }
    });
  };

  const getPermissionByAction = (action: string) =>
    permissions.find((p) => p.action === action);

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="ml-4 flex items-center gap-2">
          <Checkbox
            id={`resource-${resourceName}`}
            checked={resourceSelected}
            aria-checked={resourceIndeterminate ? "mixed" : undefined}
            onClick={handleResourceToggle}
          />
          <Label
            htmlFor={`resource-${resourceName}`}
            className="text-sm"
          >
            {resourceName}
          </Label>
        </div>
      </TableCell>
      {columns.map((col) => {
        const permission = getPermissionByAction(col);
        const hasPermission = !!permission;
        const isChecked = hasPermission && selectedPermissions.has(permission.id);
        return (
          <TableCell key={`${resourceName}-${col}`} className="text-center">
            {hasPermission ? (
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => onTogglePermission(permission.id)}
                aria-label={`Allow ${resourceName} ${col}`}
                className="justify-center"
              />
            ) : (
              <span className="text-xs text-muted-foreground/40">—</span>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
