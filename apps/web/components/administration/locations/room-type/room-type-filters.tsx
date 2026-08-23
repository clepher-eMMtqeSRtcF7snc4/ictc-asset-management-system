"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RoomTypeFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function RoomTypeFilters({
  search,
  onSearchChange,
}: RoomTypeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search room types..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
