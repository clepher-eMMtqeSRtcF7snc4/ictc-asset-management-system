"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { InventoryItem } from "../types"

interface InventoryStockSummaryProps {
  item: InventoryItem
}

export function InventoryStockSummary({ item }: InventoryStockSummaryProps) {
  const available = Math.max(0, item.quantity)
  const reserved = 0
  const reorderLevel = item.minStock * 2

  const cards = [
    { label: "Current Stock", value: item.quantity, color: "text-primary" },
    { label: "Reserved", value: reserved, color: "text-amber-600" },
    { label: "Available", value: available, color: "text-emerald-600" },
    { label: "Minimum", value: item.minStock, color: "text-red-600" },
    { label: "Reorder Level", value: reorderLevel, color: "text-purple-600" },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
            <p className={`mt-1 text-xl font-bold tabular-nums ${card.color}`}>{card.value.toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
