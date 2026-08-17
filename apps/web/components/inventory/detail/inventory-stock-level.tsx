"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { InventoryItem } from "../types"

interface InventoryStockLevelProps {
  item: InventoryItem
}

export function InventoryStockLevel({ item }: InventoryStockLevelProps) {
  const percentage = item.minStock > 0 ? Math.min(100, Math.max(0, (item.quantity / (item.minStock * 3)) * 100)) : 0
  const isLow = item.quantity <= item.minStock
  const isOut = item.quantity === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Stock Level</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Current Stock</span>
            <span className="tabular-nums">{item.quantity.toLocaleString()} {item.unit}</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>Minimum: {item.minStock}</span>
            <span>Max: {item.minStock * 3}</span>
          </div>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs font-medium text-muted-foreground">Status</p>
          <p className={`mt-1 text-sm font-semibold ${isOut ? "text-red-600" : isLow ? "text-amber-600" : "text-emerald-600"}`}>
            {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
          </p>
          {isLow && !isOut && (
            <p className="mt-1 text-xs text-muted-foreground">Consider reordering soon. Current stock is at or below minimum level.</p>
          )}
          {isOut && (
            <p className="mt-1 text-xs text-muted-foreground">Item is out of stock. Immediate reorder recommended.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
