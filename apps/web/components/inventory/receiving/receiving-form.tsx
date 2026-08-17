"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InventoryHeader } from "../inventory-header"
import { ReceivingTable as ReceivingTableComponent } from "./receiving-table"
import { ReceivingFilters, initialReceivingFilters } from "./receiving-filters"
import { ReceivingDialog } from "./receiving-dialog"
import { receivingRecords } from "../types"
import type { ReceivingRecord } from "../types"

// TODO: Replace mock data with tRPC query.
const defaultRecords = receivingRecords

export function ReceivingTable() {
  const [records, setRecords] = useState<ReceivingRecord[]>(defaultRecords)
  const [filters, setFilters] = useState(initialReceivingFilters)
  const [showColumns, setShowColumns] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered = records.filter((r) => {
    if (filters.search) {
      const s = filters.search.toLowerCase()
      if (!r.referenceNo.toLowerCase().includes(s) && !r.supplier.toLowerCase().includes(s)) return false
    }
    if (filters.status !== "ALL" && r.status !== filters.status) return false
    if (filters.supplier !== "ALL" && r.supplier !== filters.supplier) return false
    return true
  })

  const handleSave = (values: Record<string, unknown>) => {
    // TODO: Replace local CRUD with tRPC mutation.
    const newRecord: ReceivingRecord = {
      id: `receiving-${Date.now()}`,
      referenceNo: values.deliveryReceiptNo as string,
      supplier: values.supplier as string,
      receivedDate: values.receivedDate as string,
      totalItems: 0,
      totalCost: 0,
      status: "DRAFT",
      receivedBy: values.receivedBy as string,
      notes: (values.notes as string) ?? "",
    }
    setRecords((prev) => [...prev, newRecord])
    toast.success("Receiving record created successfully")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <InventoryHeader
        title="Receiving"
        description="Track incoming inventory from suppliers and manage delivery receipts."
        breadcrumb={["Dashboard", "Inventory", "Receiving"]}
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus /> New Receiving
          </Button>
        }
      />

      <ReceivingFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialReceivingFilters)}
        onColumns={() => setShowColumns((v) => !v)}
      />

      <ReceivingTableComponent data={filtered} showColumns={showColumns} />

      <ReceivingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        title="Create Receiving Record"
      />
    </div>
  )
}
