"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InventoryItem } from "../types"

interface InventoryItemInformationProps {
  item: InventoryItem
}

export function InventoryItemInformation({ item }: InventoryItemInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Item Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <InfoItem label="Item Name" value={item.name} />
          <InfoItem label="SKU" value={item.sku} />
          <InfoItem label="Category" value={item.category} />
          <InfoItem label="Unit" value={item.unit} />
          <InfoItem label="Location" value={item.location} />
          <InfoItem label="Supplier" value={item.supplier} />
          <InfoItem label="Unit Cost" value={`₱${item.unitCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`} />
          <InfoItem label="Last Updated" value={item.lastUpdated} />
          <InfoItem label="Last Received" value={item.lastReceived} />
          <InfoItem label="Description" value={item.description} />
        </dl>
      </CardContent>
    </Card>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  )
}
