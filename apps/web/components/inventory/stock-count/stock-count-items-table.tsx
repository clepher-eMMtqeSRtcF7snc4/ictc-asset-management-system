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
import { inventoryItems } from "../types"
import type { StockCountLineItem } from "../types"

interface StockCountItemsTableProps {
  items?: StockCountLineItem[]
  onChange?: (items: StockCountLineItem[]) => void
}

export function StockCountItemsTable({ items, onChange }: StockCountItemsTableProps) {
  const [internalItems, setInternalItems] = useState<StockCountLineItem[]>([])

  const data = items ?? internalItems

  const updateItem = (id: string, field: keyof StockCountLineItem, value: string | number) => {
    const updated = data.map((item) => {
      if (item.id !== id) return item
      const updatedItem = { ...item, [field]: value }
      if (field === "systemQty" || field === "countedQty") {
        const systemQty = field === "systemQty" ? Number(value) : item.systemQty
        const countedQty = field === "countedQty" ? Number(value) : item.countedQty
        updatedItem.variance = countedQty - systemQty
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
    const newItem: StockCountLineItem = {
      id: `line-${Date.now()}`,
      itemId: "",
      sku: "",
      itemName: "",
      systemQty: 0,
      countedQty: 0,
      variance: 0,
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
              <TableHead className="text-xs">Item</TableHead>
              <TableHead className="text-xs">Expected Qty</TableHead>
              <TableHead className="text-xs">Counted Qty</TableHead>
              <TableHead className="text-xs">Variance</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-16 text-center text-xs text-muted-foreground">
                  No items added yet.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Select
                      value={item.itemId}
                      onValueChange={(value) => {
                        const found = inventoryItems.find((i) => i.id === value)
                        updateItem(item.id, "itemId", value)
                        if (found) {
                          updateItem(item.id, "sku", found.sku)
                          updateItem(item.id, "itemName", found.name)
                          updateItem(item.id, "systemQty", found.quantity)
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((invItem) => (
                          <SelectItem key={invItem.id} value={invItem.id}>
                            {invItem.sku} - {invItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.systemQty || ""}
                      onChange={(e) => updateItem(item.id, "systemQty", e.target.value)}
                      placeholder="0"
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.countedQty || ""}
                      onChange={(e) => updateItem(item.id, "countedQty", e.target.value)}
                      placeholder="0"
                      className="h-8 text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs tabular-nums ${item.variance !== 0 ? (item.variance > 0 ? "text-emerald-600" : "text-red-600") : ""}`}>
                      {item.variance > 0 ? `+${item.variance}` : item.variance}
                    </span>
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
