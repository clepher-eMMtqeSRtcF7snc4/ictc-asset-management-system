"use client"

import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { InventoryHeader } from "./inventory-header"
import { inventoryItems } from "./types"
import type { InventoryItemStatus } from "./types"

const statusVariant: Record<InventoryItemStatus, "success" | "warning" | "destructive"> = {
  IN_STOCK: "success",
  LOW_STOCK: "warning",
  OUT_OF_STOCK: "destructive",
}

const statusLabel: Record<InventoryItemStatus, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
}

const transactions = [
  { date: "Aug 10, 2026", type: "Stock In", reference: "RCV-2026-0001", quantity: "+50", by: "Juan Dela Cruz", note: "Regular replenishment" },
  { date: "Aug 08, 2026", type: "Issuance", reference: "ISS-2026-0001", quantity: "-4", by: "Juan Dela Cruz", note: "Lab setup for new classroom" },
  { date: "Jul 25, 2026", type: "Stock In", reference: "RCV-2026-0002", quantity: "+30", by: "Maria Santos", note: "New stock for peripherals" },
  { date: "Jul 20, 2026", type: "Adjustment", reference: "ADJ-2026-0001", quantity: "-2", by: "Juan Dela Cruz", note: "Damaged during inspection" },
  { date: "Jun 15, 2026", type: "Stock In", reference: "RCV-2026-0003", quantity: "+20", by: "Juan Dela Cruz", note: "Toner replenishment" },
]

export function InventoryItemDetail({ itemId }: { itemId: string }) {
  const item = inventoryItems.find((i) => i.id === itemId)

  if (!item) {
    return (
      <div className="space-y-6">
        <InventoryHeader
          title="Item Not Found"
          description="The inventory item you are looking for does not exist."
          breadcrumb={["Dashboard", "Inventory", "Item Detail"]}
        />
        <Button asChild variant="outline">
          <Link href="/inventory/items"><ArrowLeft /> Back to Items</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <InventoryHeader
        title={item.name}
        description={`${item.sku} — ${item.category}`}
        breadcrumb={["Dashboard", "Inventory", "Item Detail"]}
        action={
          <>
            <Button variant="outline"><Printer /> Print</Button>
            <Button asChild variant="outline">
              <Link href="/inventory/items"><ArrowLeft /> Back to Items</Link>
            </Button>
          </>
        }
      />

      {/* Detail Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField label="SKU" value={item.sku} mono />
              <DetailField label="Category" value={item.category} />
              <DetailField label="Unit of Measure" value={item.unit} />
              <DetailField label="Unit Cost" value={`₱${item.unitCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`} />
              <DetailField label="Storage Location" value={item.location} />
              <DetailField label="Supplier" value={item.supplier} />
              <div className="sm:col-span-2">
                <DetailField label="Description" value={item.description} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold">{item.quantity}</p>
              <p className="text-sm text-muted-foreground">Current Quantity</p>
            </div>
            <Separator />
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Minimum Stock</span>
                <span className="font-medium">{item.minStock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock Value</span>
                <span className="font-medium">₱{(item.quantity * item.unitCost).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={statusVariant[item.status]}>{statusLabel[item.status]}</Badge>
              </div>
            </div>
            <Separator />
            <div className="grid gap-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span>{item.lastUpdated}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Received</span>
                <span>{item.lastReceived}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b px-5 py-4">
            <h2 className="text-sm font-semibold">Transaction History</h2>
            <p className="text-xs text-muted-foreground">Stock movements for this item</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs text-muted-foreground">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3">By</th>
                  <th className="p-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.reference} className="border-b">
                    <td className="p-3">{tx.date}</td>
                    <td className="p-3">
                      <Badge variant="outline">{tx.type}</Badge>
                    </td>
                    <td className="p-3 font-mono text-xs">{tx.reference}</td>
                    <td className={`p-3 text-right font-mono tabular-nums ${tx.quantity.startsWith("+") ? "text-success" : "text-destructive"}`}>
                      {tx.quantity}
                    </td>
                    <td className="p-3">{tx.by}</td>
                    <td className="p-3 text-xs text-muted-foreground">{tx.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 font-medium ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  )
}
