"use client"

import { Search, Columns3, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type IssuanceFilters = {
  search: string
  status: string
  department: string
}

export const initialIssuanceFilters: IssuanceFilters = {
  search: "",
  status: "ALL",
  department: "ALL",
}

export function IssuanceFilters({
  filters,
  onChange,
  onReset,
  onColumns,
}: {
  filters: IssuanceFilters
  onChange: (filters: IssuanceFilters) => void
  onReset: () => void
  onColumns: () => void
}) {
  const update = (key: keyof IssuanceFilters, value: string) => onChange({ ...filters, [key]: value })

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            className="pl-9"
            placeholder="Search reference no., requestor, department..."
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
          value={filters.status}
          placeholder="All Statuses"
          values={["DRAFT", "ISSUED", "APPROVED", "CANCELLED"]}
          onChange={(value) => update("status", value)}
        />
        <FilterSelect
          value={filters.department}
          placeholder="All Departments"
          values={["College of Computing", "Engineering", "Administration", "Accounting", "ICT", "Library", "IT Support Desk"]}
          onChange={(value) => update("department", value)}
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
