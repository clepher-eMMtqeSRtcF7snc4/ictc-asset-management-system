"use client"

import Link from "next/link"
import { Eye, PackagePlus, AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InventoryItem } from "../types"
import type { ReorderItem } from "../types"

interface LowStockItemsProps {
  items: InventoryItem[]
  reorderItems: ReorderItem[]
}

const statusVariant = {
  IN_STOCK: "success" as const,
  LOW_STOCK: "warning" as const,
  OUT_OF_STOCK: "destructive" as const,
}

const statusLabel = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
}

export function LowStockItems({ items, reorderItems }: LowStockItemsProps) {
  const lowStockItems = items.filter((item) => item.quantity <= item.minStock)

  if (lowStockItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Low Stock Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <PackagePlus className="size-4" />
            <span>All items are above minimum stock levels.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Low Stock Items</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr>
                <th className="p-3">Item Code</th>
                <th className="p-3">Item Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Current Stock</th>
                <th className="p-3 text-right">Min Level</th>
                <th className="p-3 text-right">Reorder Level</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item) => {
                const reorder = reorderItems.find((r) => r.itemId === item.id)
                return (
                  <tr key={item.id} className="border-b">
                    <td className="p-3 font-mono text-xs">{item.sku}</td>
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-xs">{item.category}</td>
                    <td className="p-3 text-right tabular-nums">{item.quantity}</td>
                    <td className="p-3 text-right tabular-nums">{item.minStock}</td>
                    <td className="p-3 text-right tabular-nums">{reorder?.reorderQty ?? "-"}</td>
                    <td className="p-3 text-center">
                      <Badge variant={statusVariant[item.status]}>{statusLabel[item.status]}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button size="xs" variant="ghost" asChild>
                          <Link href={`/inventory/${item.id}`}>
                            <Eye className="size-3" />
                          </Link>
                        </Button>
                        {!reorder && (
                          <Button size="xs" variant="ghost" asChild>
                            <Link href={`/inventory/reorder?itemId=${item.id}`}>
                              <PackagePlus className="size-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
