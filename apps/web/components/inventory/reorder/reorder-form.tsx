"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InventoryHeader } from "../inventory-header"
import { ReorderTable as ReorderTableComponent } from "./reorder-table"
import { ReorderFilters, initialReorderFilters } from "./reorder-filters"
import { ReorderDialog } from "./reorder-dialog"
import { reorderItems } from "../types"
import type { ReorderItem } from "../types"

// TODO: Replace mock data with tRPC query.
const defaultItems = reorderItems

export function ReorderTable() {
  const [items, setItems] = useState<ReorderItem[]>(defaultItems)
  const [filters, setFilters] = useState(initialReorderFilters)
  const [showColumns, setShowColumns] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered = items.filter((item) => {
    if (filters.search) {
      const s = filters.search.toLowerCase()
      if (!item.sku.toLowerCase().includes(s) && !item.name.toLowerCase().includes(s) && !item.supplier.toLowerCase().includes(s)) return false
    }
    if (filters.priority !== "ALL" && item.priority !== filters.priority) return false
    if (filters.category !== "ALL" && item.category !== filters.category) return false
    return true
  })

  const handleSave = (values: Record<string, unknown>) => {
    // TODO: Replace local CRUD with tRPC mutation.
    const newItem: ReorderItem = {
      id: `ro-${Date.now()}`,
      itemId: values.itemId as string,
      sku: `SKU-${Date.now()}`,
      name: "New Item",
      category: "",
      currentStock: 0,
      minStock: 0,
      reorderQty: Number(values.suggestedQuantity) || 0,
      supplier: values.supplier as string,
      unitCost: 0,
      estimatedTotal: 0,
      priority: values.priority as ReorderItem["priority"],
    }
    setItems((prev) => [...prev, newItem])
    toast.success("Reorder item created successfully")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <InventoryHeader
        title="Reorder"
        description="Monitor items that need replenishment and create purchase requests."
        breadcrumb={["Dashboard", "Inventory", "Reorder"]}
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus /> New Reorder
          </Button>
        }
      />

      <ReorderFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialReorderFilters)}
        onColumns={() => setShowColumns((v) => !v)}
      />

      <ReorderTableComponent data={filtered} showColumns={showColumns} />

      <ReorderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        title="Create Reorder"
      />
    </div>
  )
}
