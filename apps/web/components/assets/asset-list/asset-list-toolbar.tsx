"use client";

import { Columns3, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AssetFilters = {
  search: string;
  category: string;
  status: string;
  department: string;
  condition: string;
};

export function AssetListToolbar({
  filters,
  onChange,
  onReset,
  onColumns,
}: {
  filters: AssetFilters;
  onChange: (filters: AssetFilters) => void;
  onReset: () => void;
  onColumns: () => void;
}) {
  const update = (key: keyof AssetFilters, value: string) =>
    onChange({ ...filters, [key]: value });
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            className="pl-9"
            placeholder="Search asset tag, property no., serial no., asset name..."
          />
        </div>

        <Button variant="outline">
          <SlidersHorizontal /> Filters
        </Button>
        <Button variant="outline" onClick={onColumns}>
          <Columns3 /> Columns
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw /> Reset
        </Button>
      </div>
      
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect
          value={filters.category}
          placeholder="All Categories"
          values={[
            "Laptop",
            "Desktop",
            "Monitor",
            "Printer",
            "Network Equipment",
            "UPS",
            "Storage",
            "Projector",
            "Peripheral",
          ]}
          onChange={(value) => update("category", value)}
        />
        <FilterSelect
          value={filters.status}
          placeholder="All Statuses"
          values={[
            "AVAILABLE",
            "ASSIGNED",
            "UNDER_MAINTENANCE",
            "FOR_TRANSFER",
            "FOR_DISPOSAL",
            "DISPOSED",
          ]}
          onChange={(value) => update("status", value)}
        />
        <FilterSelect
          value={filters.department}
          placeholder="All Departments"
          values={[
            "ICT",
            "Engineering",
            "Accounting",
            "Supply",
            "Registrar",
            "Administration",
          ]}
          onChange={(value) => update("department", value)}
        />
        <FilterSelect
          value={filters.condition}
          placeholder="All Conditions"
          values={["EXCELLENT", "GOOD", "FAIR", "POOR"]}
          onChange={(value) => update("condition", value)}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  placeholder,
  values,
  onChange,
}: {
  value: string;
  placeholder: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">{placeholder}</SelectItem>
        {values.map((item) => (
          <SelectItem key={item} value={item}>
            {item.replaceAll("_", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
