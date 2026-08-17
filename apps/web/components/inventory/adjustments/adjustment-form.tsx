"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InventoryHeader } from "../inventory-header"
import { AdjustmentsTable as AdjustmentsTableComponent } from "./adjustments-table"
import { AdjustmentFilters, initialAdjustmentFilters } from "./adjustment-filters"
import { AdjustmentDialog } from "./adjustment-dialog"
import { adjustmentRecords } from "../types"
import type { AdjustmentRecord } from "../types"

// TODO: Replace mock data with tRPC query.
const defaultRecords = adjustmentRecords

export function AdjustmentsTable() {
  const [records, setRecords] = useState<AdjustmentRecord[]>(defaultRecords)
  const [filters, setFilters] = useState(initialAdjustmentFilters)
  const [showColumns, setShowColumns] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered = records.filter((r) => {
    if (filters.search) {
      const s = filters.search.toLowerCase()
      if (!r.referenceNo.toLowerCase().includes(s) && !r.reason.toLowerCase().includes(s)) return false
    }
    if (filters.type !== "ALL" && r.type !== filters.type) return false
    if (filters.status !== "ALL" && r.status !== filters.status) return false
    return true
  })

  const handleSave = (values: Record<string, unknown>) => {
    // TODO: Replace local CRUD with tRPC mutation.
    const newRecord: AdjustmentRecord = {
      id: `adjustment-${Date.now()}`,
      referenceNo: values.referenceNo as string,
      adjustmentDate: values.adjustmentDate as string,
      type: values.type as "INCREASE" | "DECREASE",
      reason: values.reason as string,
      reference: (values.reference as string) ?? "",
      adjustedBy: values.adjustedBy as string,
      status: "DRAFT",
      totalItems: 0,
    }
    setRecords((prev) => [...prev, newRecord])
    toast.success("Adjustment record created successfully")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <InventoryHeader
        title="Adjustments"
        description="Track stock adjustments for discrepancies, damages, and corrections."
        breadcrumb={["Dashboard", "Inventory", "Adjustments"]}
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus /> New Adjustment
          </Button>
        }
      />

      <AdjustmentFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialAdjustmentFilters)}
        onColumns={() => setShowColumns((v) => !v)}
      />

      <AdjustmentsTableComponent data={filtered} showColumns={showColumns} />

      <AdjustmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        title="Create Adjustment Record"
      />
    </div>
  )
}
