"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InventoryHeader } from "../inventory-header"
import { StockCountTable as StockCountTableComponent } from "./stock-count-table"
import { StockCountFilters, initialStockCountFilters } from "./stock-count-filters"
import { StockCountDialog } from "./stock-count-dialog"
import { stockCountRecords } from "../types"
import type { StockCountRecord } from "../types"

// TODO: Replace mock data with tRPC query.
const defaultRecords = stockCountRecords

export function StockCountTable() {
  const [records, setRecords] = useState<StockCountRecord[]>(defaultRecords)
  const [filters, setFilters] = useState(initialStockCountFilters)
  const [showColumns, setShowColumns] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered = records.filter((r) => {
    if (filters.search) {
      const s = filters.search.toLowerCase()
      if (!r.referenceNo.toLowerCase().includes(s) && !r.location.toLowerCase().includes(s)) return false
    }
    if (filters.status !== "ALL" && r.status !== filters.status) return false
    if (filters.location !== "ALL" && r.location !== filters.location) return false
    return true
  })

  const handleSave = (values: Record<string, unknown>) => {
    // TODO: Replace local CRUD with tRPC mutation.
    const newRecord: StockCountRecord = {
      id: `stockcount-${Date.now()}`,
      referenceNo: values.referenceNo as string,
      countDate: values.countDate as string,
      location: values.location as string,
      countedBy: values.countedBy as string,
      totalItems: 0,
      variances: 0,
      status: "DRAFT",
    }
    setRecords((prev) => [...prev, newRecord])
    toast.success("Stock count record created successfully")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <InventoryHeader
        title="Stock Count"
        description="Perform physical inventory counts and reconcile discrepancies."
        breadcrumb={["Dashboard", "Inventory", "Stock Count"]}
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus /> New Stock Count
          </Button>
        }
      />

      <StockCountFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialStockCountFilters)}
        onColumns={() => setShowColumns((v) => !v)}
      />

      <StockCountTableComponent data={filtered} showColumns={showColumns} />

      <StockCountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        title="Create Stock Count"
      />
    </div>
  )
}
