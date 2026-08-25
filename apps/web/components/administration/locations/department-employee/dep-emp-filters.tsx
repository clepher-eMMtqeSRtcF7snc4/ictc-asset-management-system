"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";

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
          { id: "active", name: "Active" },
          { id: "casual", name: "Casual" },
          { id: "contractual", name: "Contractual" },
          { id: "deceased", name: "Deceased" },
          { id: "end-of-contract", name: "End of Contract" },
          { id: "inactive", name: "Inactive" },
          { id: "job-order", name: "Job Order" },
          { id: "on-leave", name: "On Leave" },
          { id: "permanent", name: "Permanent" },
          { id: "probationary", name: "Probationary" },
          { id: "retired", name: "Retired" },
          { id: "suspended", name: "Suspended" },
          { id: "temporary", name: "Temporary" },
          { id: "terminated", name: "Terminated" },
        ]}
        value={status}
        onValueChange={onStatusChange}
        placeholder="Status"
      />
    </div>
  );
}
