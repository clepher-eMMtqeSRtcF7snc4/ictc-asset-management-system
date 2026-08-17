"use client"

import Link from "next/link"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  ClipboardCheck,
  PackagePlus,
  RotateCcw,
  TriangleAlert,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InventoryHeader } from "./inventory-header"

const summaryCards = [
  { label: "Inventory Items", value: "737", description: "Total unique items tracked", icon: Boxes, href: "/inventory/items" },
  { label: "Total Units in Stock", value: "12,846", description: "Quantity on hand across all items", icon: Boxes, href: "/inventory/items" },
  { label: "Low Stock Items", value: "42", description: "Items at or below minimum level", icon: TriangleAlert, href: "/inventory/reorder" },
  { label: "Out of Stock", value: "11", description: "Items with zero quantity", icon: TriangleAlert, href: "/inventory/reorder" },
]

const recentActivity = [
  { action: "Stock In", reference: "RCV-2026-0006", detail: "National Bookstore - 2 items received", time: "2 hours ago", icon: ArrowDownToLine, color: "text-success" },
  { action: "Issuance", reference: "ISS-2026-0001", detail: "College of Computing - 15 items issued", time: "5 hours ago", icon: ArrowUpFromLine, color: "text-info" },
  { action: "Stock In", reference: "RCV-2026-0005", detail: "TechSource Philippines - 6 items received", time: "1 day ago", icon: ArrowDownToLine, color: "text-success" },
  { action: "Adjustment", reference: "ADJ-2026-0004", detail: "System correction from stock count", time: "2 days ago", icon: RotateCcw, color: "text-warning" },
  { action: "Stock Count", reference: "SC-2026-0001", detail: "ICT Stockroom A - 3 variances found", time: "3 days ago", icon: ClipboardCheck, color: "text-purple" },
]

const lowStockItems = [
  { sku: "SKU-TON-BK-205", name: "HP 205A Black Toner", current: 0, min: 5, status: "OUT_OF_STOCK" as const },
  { sku: "SKU-FAN-CPU-120", name: "120mm CPU Cooling Fan", current: 0, min: 10, status: "OUT_OF_STOCK" as const },
  { sku: "SKU-STS-WHT-4PK", name: "Whiteboard Markers (4-pack)", current: 0, min: 15, status: "OUT_OF_STOCK" as const },
  { sku: "SKU-ADP-USBC-001", name: "USB-C Adapter (Hub)", current: 8, min: 15, status: "LOW_STOCK" as const },
  { sku: "SKU-KEY-LOG-K380", name: "Logitech K380 Multi-Device", current: 5, min: 10, status: "LOW_STOCK" as const },
]

const statusVariant = {
  IN_STOCK: "success" as const,
  LOW_STOCK: "warning" as const,
  OUT_OF_STOCK: "destructive" as const,
}

export function InventoryDashboard() {
  return (
    <div className="space-y-6">
      <InventoryHeader
        title="Inventory"
        description="Control quantity-based ICT supplies, consumables, and spare parts."
        breadcrumb={["Dashboard", "Inventory"]}
        action={
          <Button asChild>
            <Link href="/inventory/items">
              <PackagePlus /> Add Item
            </Link>
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ label, value, description, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardContent className="p-4">
                <Icon className="mb-3 size-5 text-primary" />
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
                <p className="mt-2 text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardContent className="p-0">
            <div className="border-b px-5 py-4">
              <h2 className="text-sm font-semibold">Recent Activity</h2>
              <p className="text-xs text-muted-foreground">Latest inventory transactions</p>
            </div>
            <div className="divide-y">
              {recentActivity.map(({ action, reference, detail, time, icon: Icon, color }) => (
                <div key={reference} className="flex items-start gap-3 px-5 py-3">
                  <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{action}</span>
                      <span className="font-mono text-xs text-muted-foreground">{reference}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardContent className="p-0">
            <div className="border-b px-5 py-4">
              <h2 className="text-sm font-semibold">Low Stock Alerts</h2>
              <p className="text-xs text-muted-foreground">Items requiring immediate attention</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Item</th>
                    <th className="p-3 text-right">Stock</th>
                    <th className="p-3 text-right">Min</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item) => (
                    <tr key={item.sku} className="border-b">
                      <td className="p-3 font-mono text-xs text-primary">{item.sku}</td>
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className="p-3 text-right tabular-nums">{item.current}</td>
                      <td className="p-3 text-right tabular-nums">{item.min}</td>
                      <td className="p-3 text-center">
                        <Badge variant={statusVariant[item.status]}>
                          {item.status === "LOW_STOCK" ? "Low Stock" : "Out of Stock"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
