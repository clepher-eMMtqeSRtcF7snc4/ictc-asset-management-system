"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { InventoryHeader } from "../inventory-header"
import { InventoryItemHeader } from "./inventory-item-header"
import { InventoryStockSummary } from "./inventory-stock-summary"
import { InventoryItemInformation } from "./inventory-item-information"
import { InventoryStockLevel } from "./inventory-stock-level"
import { InventoryHistoryTable } from "./inventory-history-table"
import { inventoryItems } from "../types"
import type { InventoryItem } from "../types"

// TODO: Replace mock data with tRPC query.
const defaultItems = inventoryItems

export function InventoryItemDetail({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<InventoryItem | null>(null)

  useEffect(() => {
    // TODO: Replace with tRPC query.
    const found = defaultItems.find((i) => i.id === itemId)
    setItem(found ?? null)
  }, [itemId])

  if (!item) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-sm text-muted-foreground">Item not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <InventoryItemHeader item={item} />

      <InventoryStockSummary item={item} />

      <div className="grid gap-5 lg:grid-cols-2">
        <InventoryItemInformation item={item} />
        <InventoryStockLevel item={item} />
      </div>

      <InventoryHistoryTable itemId={itemId} />
    </div>
  )
}
