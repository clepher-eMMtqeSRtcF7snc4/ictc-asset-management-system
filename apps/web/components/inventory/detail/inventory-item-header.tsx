"use client"

import Link from "next/link"
import { ArrowLeft, Package, MapPin, Building2, Tag, FileText, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "../types"
import type { InventoryItem } from "../types"

interface InventoryItemHeaderProps {
  item: InventoryItem
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

export function InventoryItemHeader({ item }: InventoryItemHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/inventory/items">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <p className="text-xs text-muted-foreground">
            <Link href="/inventory/items" className="hover:underline">Inventory</Link>
            <span className="mx-2">/</span>
            <span>Item Details</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">{item.name}</h1>
            <Badge variant={statusVariant[item.status]}>{statusLabel[item.status]}</Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{item.sku}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm"><Printer className="mr-2 size-4" /> Print Label</Button>
        <Button variant="outline" size="sm">Stock In</Button>
        <Button variant="outline" size="sm">Stock Out</Button>
        <Button variant="outline" size="sm">Adjust</Button>
      </div>
    </div>
  )
}
