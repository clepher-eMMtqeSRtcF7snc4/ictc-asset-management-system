"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <Select value={departmentId} onValueChange={onDepartmentIdChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={String(dept.id)}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="retire">Retire</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
