"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";

interface EmployeeFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  departmentId: string;
  onDepartmentIdChange: (value: string) => void;
  departments: { id: number; name: string }[];
  position: string;
  onPositionChange: (value: string) => void;
  designation: string;
  onDesignationChange: (value: string) => void;
  positions: { id: string; name: string }[];
  designations: { id: string; name: string }[];
  status: "all" | "active" | "inactive" | "retire";
  onStatusChange: (value: "all" | "active" | "inactive" | "retire") => void;
}

export function EmployeeFilters({
  search,
  onSearchChange,
  departmentId,
  onDepartmentIdChange,
  departments,
  position,
  onPositionChange,
  designation,
  onDesignationChange,
  positions,
  designations,
  status,
  onStatusChange,
}: EmployeeFiltersProps) {
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
        options={[
          { id: "all", name: "All Departments" },
          ...departments.map((dept) => ({ id: String(dept.id), name: dept.name })),
        ]}
        value={departmentId}
        onValueChange={onDepartmentIdChange}
        placeholder="Department"
      />
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
          { id: "active", name: "Active" },
          { id: "inactive", name: "Inactive" },
          { id: "retire", name: "Retire" },
        ]}
        value={status}
        onValueChange={(value) => onStatusChange(value as "all" | "active" | "inactive" | "retire")}
        placeholder="Status"
      />
    </div>
  );
}
