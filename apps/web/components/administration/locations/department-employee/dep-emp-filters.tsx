"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { EMPLOYEE_STATUSES } from "@repo/trpc/schemas";

interface DepartmentEmployeeFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  position: string;
  onPositionChange: (value: string) => void;
  designation: string;
  onDesignationChange: (value: string) => void;
  positions: { id: string; name: string }[];
  designations: { id: string; name: string }[];
}

export function DepartmentEmployeeFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  position,
  onPositionChange,
  designation,
  onDesignationChange,
  positions,
  designations,
}: DepartmentEmployeeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Combobox
        options={positions}
        value={position}
        onValueChange={onPositionChange}
        placeholder="Position"
      />
      <Combobox
        options={designations}
        value={designation}
        onValueChange={onDesignationChange}
        placeholder="Designation"
      />
      <Combobox
        options={[
          { id: "all", name: "All Status" },
          ...EMPLOYEE_STATUSES.map((s) => ({ id: s, name: s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) })),
        ]}
        value={status}
        onValueChange={onStatusChange}
        placeholder="Status"
      />
    </div>
  );
}
