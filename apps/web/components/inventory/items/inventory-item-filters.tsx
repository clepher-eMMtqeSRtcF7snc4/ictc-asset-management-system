"use client"

import { Columns3, RotateCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type InventoryItemFilters = {
  search: string
  category: string
  location: string
  status: string
  supplier: string
}

const initialFilters: InventoryItemFilters = {
  search: "",
  category: "ALL",
  location: "ALL",
  status: "ALL",
  supplier: "ALL",
}

export { initialFilters }

export function InventoryItemFilters({
  filters,
  onChange,
  onReset,
  onColumns,
}: {
  filters: InventoryItemFilters
  onChange: (filters: InventoryItemFilters) => void
  onReset: () => void
  onColumns: () => void
}) {
  const update = (key: keyof InventoryItemFilters, value: string) => onChange({ ...filters, [key]: value })

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            className="pl-9"
            placeholder="Search SKU, item name, supplier..."
          />
        </div>
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
          values={["Cables", "Adapters", "Toner", "Peripherals", "Storage", "Storage Media", "Components", "Supplies", "Ink"]}
          onChange={(value) => update("category", value)}
        />
        <FilterSelect
          value={filters.location}
          placeholder="All Locations"
          values={["ICT Stockroom A", "ICT Stockroom B", "Supply Room"]}
          onChange={(value) => update("location", value)}
        />
        <FilterSelect
          value={filters.status}
          placeholder="All Statuses"
          values={["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]}
          onChange={(value) => update("status", value)}
        />
        <FilterSelect
          value={filters.supplier}
          placeholder="All Suppliers"
          values={["TechSource Philippines", "Datablitz Inc.", "HP Authorized Reseller", "CD-R King", "National Bookstore", "Epson Philippines"]}
          onChange={(value) => update("supplier", value)}
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
