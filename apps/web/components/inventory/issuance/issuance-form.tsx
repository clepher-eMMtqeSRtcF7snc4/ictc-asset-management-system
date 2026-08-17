"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InventoryHeader } from "../inventory-header"
import { IssuanceTable as IssuanceTableComponent } from "./issuance-table"
import { IssuanceFilters, initialIssuanceFilters } from "./issuance-filters"
import { IssuanceDialog } from "./issuance-dialog"
import { issuanceRecords } from "../types"
import type { IssuanceRecord } from "../types"

// TODO: Replace mock data with tRPC query.
const defaultRecords = issuanceRecords

export function IssuanceTable() {
  const [records, setRecords] = useState<IssuanceRecord[]>(defaultRecords)
  const [filters, setFilters] = useState(initialIssuanceFilters)
  const [showColumns, setShowColumns] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered = records.filter((r) => {
    if (filters.search) {
      const s = filters.search.toLowerCase()
      if (!r.referenceNo.toLowerCase().includes(s) && !r.requester.toLowerCase().includes(s) && !r.department.toLowerCase().includes(s)) return false
    }
    if (filters.status !== "ALL" && r.status !== filters.status) return false
    if (filters.department !== "ALL" && r.department !== filters.department) return false
    return true
  })

  const handleSave = (values: Record<string, unknown>) => {
    // TODO: Replace local CRUD with tRPC mutation.
    const newRecord: IssuanceRecord = {
      id: `issuance-${Date.now()}`,
      referenceNo: `ISS-${new Date().getFullYear()}-${String(records.length + 1).padStart(4, "0")}`,
      requester: values.requester as string,
      department: values.department as string,
      purpose: values.purpose as string,
      issuedDate: values.issuedDate as string,
      totalItems: 0,
      status: "DRAFT",
      issuedBy: values.issuedBy as string,
      notes: (values.notes as string) ?? "",
    }
    setRecords((prev) => [...prev, newRecord])
    toast.success("Issuance record created successfully")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <InventoryHeader
        title="Issuance"
        description="Manage stock issuance requests and track issued items to departments."
        breadcrumb={["Dashboard", "Inventory", "Issuance"]}
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus /> New Issuance
          </Button>
        }
      />

      <IssuanceFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialIssuanceFilters)}
        onColumns={() => setShowColumns((v) => !v)}
      />

      <IssuanceTableComponent data={filtered} showColumns={showColumns} />

      <IssuanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        title="Create Issuance Record"
      />
    </div>
  )
}
