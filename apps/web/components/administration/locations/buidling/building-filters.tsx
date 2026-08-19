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

interface BuildingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  // building: string;
  // onBuildingChange: (value: string) => void;
  // floor: string;
  // onFloorChange: (value: string) => void;
  // department: string;
  // onDepartmentChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

// const buildings = ["Administration Building", "Academic Building", "ICT Center"];
// const floors = ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"];
// const departments = ["ICT", "Supply", "Accounting", "HR"];

export function BuildingFilters({
  search,
  onSearchChange,
  // building,
  // onBuildingChange,
  // floor,
  // onFloorChange,
  // department,
  // onDepartmentChange,
  status,
  onStatusChange,
}: BuildingFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search buildings..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      {/* <Select value={building} onValueChange={onBuildingChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Building" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Buildings</SelectItem>
          {buildings.map((b) => (
            <SelectItem key={b} value={b}>
              {b}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}
      {/* <Select value={floor} onValueChange={onFloorChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Floor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Floors</SelectItem>
          {floors.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}
      {/* <Select value={department} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
