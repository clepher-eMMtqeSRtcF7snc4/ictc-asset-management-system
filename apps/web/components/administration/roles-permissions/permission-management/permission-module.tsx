"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PermissionModuleProps {
  moduleName: string;
  moduleSelected: boolean;
  moduleIndeterminate: boolean;
  onSelect: () => void;
}

export function PermissionModule({
  moduleName,
  moduleSelected,
  moduleIndeterminate,
  onSelect,
}: PermissionModuleProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={`module-select-${moduleName}`}
        checked={moduleSelected}
        aria-checked={moduleIndeterminate ? "mixed" : undefined}
        onClick={onSelect}
      />
      <Label htmlFor={`module-select-${moduleName}`} className="sr-only">
        Select all permissions in {moduleName}
      </Label>
    </div>
  );
}
