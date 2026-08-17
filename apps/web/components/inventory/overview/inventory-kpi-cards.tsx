"use client"

import { Package, AlertTriangle, XCircle, Truck, ClipboardList } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InventoryItem, ReceivingRecord, IssuanceRecord } from "../types"

interface InventoryKpiCardsProps {
  items: InventoryItem[]
  receivingRecords: ReceivingRecord[]
  issuanceRecords: IssuanceRecord[]
}

export function InventoryKpiCards({ items, receivingRecords, issuanceRecords }: InventoryKpiCardsProps) {
  const totalItems = items.length
  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0)
  const lowStock = items.filter((item) => item.status === "LOW_STOCK").length
  const outOfStock = items.filter((item) => item.status === "OUT_OF_STOCK").length
  const pendingReceiving = receivingRecords.filter((r) => r.status === "DRAFT" || r.status === "RECEIVED" || r.status === "INSPECTED").length
  const pendingIssuance = issuanceRecords.filter((r) => r.status === "DRAFT" || r.status === "ISSUED").length

  const cards = [
    { title: "Total Items", value: totalItems.toLocaleString(), icon: Package, color: "text-primary" },
    { title: "Total Stock", value: totalStock.toLocaleString(), icon: Package, color: "text-blue-600" },
    { title: "Low Stock", value: lowStock.toString(), icon: AlertTriangle, color: "text-amber-600" },
    { title: "Out of Stock", value: outOfStock.toString(), icon: XCircle, color: "text-red-600" },
    { title: "Pending Receiving", value: pendingReceiving.toString(), icon: Truck, color: "text-emerald-600" },
    { title: "Pending Issuance", value: pendingIssuance.toString(), icon: ClipboardList, color: "text-purple-600" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className={`size-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
