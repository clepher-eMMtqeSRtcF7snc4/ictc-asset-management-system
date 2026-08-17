"use client"

import { Badge } from "@/components/ui/badge"
import { PackageCheck, AlertTriangle, XCircle, Archive } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InventoryItem } from "../types"

interface StockOverviewProps {
  items: InventoryItem[]
}

const statusConfig = {
  IN_STOCK: { label: "In Stock", icon: PackageCheck, color: "text-emerald-600", bg: "bg-emerald-50", variant: "success" as const },
  LOW_STOCK: { label: "Low Stock", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", variant: "warning" as const },
  OUT_OF_STOCK: { label: "Out of Stock", icon: XCircle, color: "text-red-600", bg: "bg-red-50", variant: "destructive" as const },
}

export function StockOverview({ items }: StockOverviewProps) {
  const counts = {
    IN_STOCK: items.filter((i) => i.status === "IN_STOCK").length,
    LOW_STOCK: items.filter((i) => i.status === "LOW_STOCK").length,
    OUT_OF_STOCK: items.filter((i) => i.status === "OUT_OF_STOCK").length,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Stock Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {(Object.entries(statusConfig) as [keyof typeof statusConfig, typeof statusConfig[keyof typeof statusConfig]][]).map(([key, config]) => (
            <div key={key} className={`flex items-center gap-3 rounded-lg border p-4 ${config.bg}`}>
              <config.icon className={`size-5 ${config.color}`} />
              <div>
                <p className="text-xs font-medium text-muted-foreground">{config.label}</p>
                <p className="text-xl font-bold">{counts[key].toLocaleString()}</p>
              </div>
              <Badge variant={config.variant} className="ml-auto">
                {((counts[key] / items.length) * 100).toFixed(0)}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
