"use client"

import { Search, Columns3, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type ReorderFilters = {
  search: string
  priority: string
  category: string
}

export const initialReorderFilters: ReorderFilters = {
  search: "",
  priority: "ALL",
  category: "ALL",
}

export function ReorderFilters({
  filters,
  onChange,
  onReset,
  onColumns,
}: {
  filters: ReorderFilters
  onChange: (filters: ReorderFilters) => void
  onReset: () => void
  onColumns: () => void
}) {
  const update = (key: keyof ReorderFilters, value: string) => onChange({ ...filters, [key]: value })

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            className="pl-9"
            placeholder="Search item code, item name, supplier..."
          />
        </div>
        <Button variant="outline" onClick={onColumns}>
          <Columns3 /> Columns
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw /> Reset
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FilterSelect
          value={filters.priority}
          placeholder="All Priorities"
          values={["HIGH", "MEDIUM", "LOW"]}
          onChange={(value) => update("priority", value)}
        />
        <FilterSelect
          value={filters.category}
          placeholder="All Categories"
          values={["Cables", "Adapters", "Toner", "Peripherals", "Storage", "Storage Media", "Components", "Supplies", "Ink"]}
          onChange={(value) => update("category", value)}
        />
      </div>
    </div>
  )
}

function FilterSelect({ value, placeholder, values, onChange }: { value: string; placeholder: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">{placeholder}</SelectItem>
        {values.map((item) => (
          <SelectItem key={item} value={item}>{item}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
