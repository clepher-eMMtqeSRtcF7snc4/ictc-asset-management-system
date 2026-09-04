"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface PermissionToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  availableModules: string[];
  selectedModule: string;
  onModuleChange: (module: string) => void;
  totalPermissions: number;
  assignedCount: number;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onSelectAll: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function PermissionToolbar({
  search,
  onSearchChange,
  availableModules,
  selectedModule,
  onModuleChange,
  totalPermissions,
  assignedCount,
  isAllSelected,
  isIndeterminate,
  onSelectAll,
  onExpandAll,
  onCollapseAll,
}: PermissionToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search permissions..."
            className="pl-8"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select value={selectedModule} onValueChange={onModuleChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableModules.map((mod) => (
              <SelectItem key={mod} value={mod}>
                {mod}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          {assignedCount} of {totalPermissions} selected
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            onClick={onExpandAll}
            aria-label="Expand all modules"
          >
            <ChevronDown className="h-4 w-4" />
            Expand All
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            onClick={onCollapseAll}
            aria-label="Collapse all modules"
          >
            <ChevronUp className="h-4 w-4" />
            Collapse All
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all-permissions"
            checked={isAllSelected}
            aria-checked={isIndeterminate ? "mixed" : undefined}
            onClick={onSelectAll}
          />
          <Label htmlFor="select-all-permissions" className="text-sm">
            Select All Permissions
          </Label>
        </div>
      </div>
    </div>
  );
}
