"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { InventoryHeader } from "../inventory-header"
import { InventoryKpiCards } from "./inventory-kpi-cards"
import { StockOverview } from "./stock-overview"
import { RecentInventoryActivity, buildRecentActivity } from "./recent-inventory-activity"
import { LowStockItems } from "./low-stock-items"
import { inventoryItems, receivingRecords, issuanceRecords, adjustmentRecords, stockCountRecords, reorderItems } from "../types"

// TODO: Replace mock data with tRPC query.
const mockItems = inventoryItems
const mockReceiving = receivingRecords
const mockIssuance = issuanceRecords
const mockAdjustments = adjustmentRecords
const mockStockCounts = stockCountRecords
const mockReorderItems = reorderItems

export function InventoryOverview() {
  const [showColumns, setShowColumns] = useState(false)

  const recentActivities = buildRecentActivity(mockReceiving, mockIssuance, mockAdjustments, mockStockCounts)

  return (
    <div className="space-y-6">
      <InventoryHeader
        title="Inventory Overview"
        description="Monitor inventory levels, track recent activity, and manage stock across all locations."
        breadcrumb={["Dashboard", "Inventory"]}
        action={
          <Button asChild>
            <a href="/inventory/items">
              <Plus /> Add Item
            </a>
          </Button>
        }
      />

      <InventoryKpiCards
        items={mockItems}
        receivingRecords={mockReceiving}
        issuanceRecords={mockIssuance}
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <RecentInventoryActivity activities={recentActivities} />
        <StockOverview items={mockItems} />
      </div>

      <LowStockItems items={mockItems} reorderItems={mockReorderItems} />
    </div>
  )
}
