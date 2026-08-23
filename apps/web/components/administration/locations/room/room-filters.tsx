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

interface RoomFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  floor: string;
  onFloorChange: (value: string) => void;
}

export function RoomFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  floor,
  onFloorChange,
}: RoomFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
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
      <Select value={floor} onValueChange={onFloorChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Floor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Floors</SelectItem>
          <SelectItem value="1st floor">1st Floor</SelectItem>
          <SelectItem value="2nd floor">2nd Floor</SelectItem>
          <SelectItem value="3rd floor">3rd Floor</SelectItem>
          <SelectItem value="4th floor">4th Floor</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
