"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ReceivingLineItem } from "../types"

interface ReceivingItemsTableProps {
  items?: ReceivingLineItem[]
  onChange?: (items: ReceivingLineItem[]) => void
}

export function ReceivingItemsTable({ items, onChange }: ReceivingItemsTableProps) {
  const [internalItems, setInternalItems] = useState<ReceivingLineItem[]>([])

  const data = items ?? internalItems

  const updateItem = (id: string, field: keyof ReceivingLineItem, value: string | number) => {
    const updated = data.map((item) => {
      if (item.id !== id) return item
      const updatedItem = { ...item, [field]: value }
      if (field === "quantity" || field === "unitCost") {
        const qty = field === "quantity" ? Number(value) : item.quantity
        const cost = field === "unitCost" ? Number(value) : item.unitCost
        updatedItem.totalCost = qty * cost
      }
      return updatedItem
    })
    if (onChange) {
      onChange(updated)
    } else {
      setInternalItems(updated)
    }
  }

  const addItem = () => {
    const newItem: ReceivingLineItem = {
      id: `line-${Date.now()}`,
      itemId: "",
      sku: "",
      itemName: "",
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
    }
    if (onChange) {
      onChange([...data, newItem])
    } else {
      setInternalItems([...data, newItem])
    }
  }

  const removeItem = (id: string) => {
    const updated = data.filter((item) => item.id !== id)
    if (onChange) {
      onChange(updated)
    } else {
      setInternalItems(updated)
    }
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Item Code</TableHead>
              <TableHead className="text-xs">Item Name</TableHead>
              <TableHead className="text-xs">Delivered Qty</TableHead>
              <TableHead className="text-xs">Unit Cost</TableHead>
              <TableHead className="text-xs">Total Cost</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-16 text-center text-xs text-muted-foreground">
                  No items added yet.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.sku}
                      onChange={(e) => updateItem(item.id, "sku", e.target.value)}
                      placeholder="SKU"
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.itemName}
                      onChange={(e) => updateItem(item.id, "itemName", e.target.value)}
                      placeholder="Item name"
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                      placeholder="0"
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.unitCost || ""}
                      onChange={(e) => updateItem(item.id, "unitCost", e.target.value)}
                      placeholder="0.00"
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-xs tabular-nums">₱{item.totalCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-3 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Button type="button" size="xs" variant="outline" onClick={addItem}>
        <Plus className="mr-1 size-3" /> Add Item
      </Button>
    </div>
  )
}
