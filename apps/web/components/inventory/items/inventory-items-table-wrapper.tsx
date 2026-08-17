"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/ui/datatable-pagination"
import { InventoryHeader } from "../inventory-header"
import { InventoryItemsTable as InventoryItemsTableBase } from "./inventory-items-table"
import { InventoryItemFilters, initialFilters } from "./inventory-item-filters"
import type { InventoryItemFilters as InventoryItemFiltersType } from "./inventory-item-filters"
import { InventoryItemDialog, type FormValues as ItemFormValues } from "./inventory-item-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { createInventoryItemColumns } from "./inventory-item-columns"
import { inventoryItems as mockItems } from "../types"
import type { InventoryItem } from "../types"

// TODO: Replace mock data with tRPC query.
const defaultItems = mockItems

export function InventoryItemsTable() {
  const [items, setItems] = useState<InventoryItem[]>(defaultItems)
  const [filters, setFilters] = useState<InventoryItemFiltersType>(initialFilters)
  const [showColumns, setShowColumns] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredItems = items.filter((item) => {
    if (filters.search) {
      const s = filters.search.toLowerCase()
      if (!item.sku.toLowerCase().includes(s) && !item.name.toLowerCase().includes(s) && !item.supplier.toLowerCase().includes(s)) {
        return false
      }
    }
    if (filters.category !== "ALL" && item.category !== filters.category) return false
    if (filters.location !== "ALL" && item.location !== filters.location) return false
    if (filters.status !== "ALL" && item.status !== filters.status) return false
    if (filters.supplier !== "ALL" && item.supplier !== filters.supplier) return false
    return true
  })

  const columns = createInventoryItemColumns({
    onEdit: (item) => {
      setEditingItem(item)
      setDialogOpen(true)
    },
    onStockIn: (item) => {
      toast.info(`Stock In for ${item.name}`)
    },
    onPrint: (item) => {
      toast.info(`Print label for ${item.name}`)
    },
  })

  const handleSave = (values: ItemFormValues) => {
    // TODO: Replace local CRUD with tRPC mutation.
    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                sku: values.sku,
                name: values.name,
                description: values.description ?? "",
                category: values.category,
                unit: values.unit,
                unitCost: Number(values.unitCost) || 0,
                quantity: Number(values.quantity) || 0,
                minStock: Number(values.minStock) || 0,
                location: values.location,
                supplier: values.supplier,
                lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              }
            : item,
        ),
      )
      toast.success("Item updated successfully")
    } else {
      const newItem: InventoryItem = {
        id: `item-${Date.now()}`,
        sku: values.sku,
        name: values.name,
        description: values.description ?? "",
        category: values.category,
        unit: values.unit,
        unitCost: Number(values.unitCost) || 0,
        quantity: Number(values.quantity) || 0,
        minStock: Number(values.minStock) || 0,
        location: values.location,
        supplier: values.supplier,
        status: (Number(values.quantity) || 0) === 0 ? "OUT_OF_STOCK" : (Number(values.quantity) || 0) <= (Number(values.minStock) || 0) ? "LOW_STOCK" : "IN_STOCK",
        lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        lastReceived: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      }
      setItems((prev) => [...prev, newItem])
      toast.success("Item created successfully")
    }
    setDialogOpen(false)
    setEditingItem(null)
  }

  const handleDelete = () => {
    if (!deletingId) return
    // TODO: Replace local CRUD with tRPC mutation.
    setItems((prev) => prev.filter((item) => item.id !== deletingId))
    toast.success("Item deactivated successfully")
    setDeletingId(null)
  }

  const openCreate = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <InventoryHeader
        title="Inventory Items"
        description="Manage all inventory items, track stock levels, and update item information."
        breadcrumb={["Dashboard", "Inventory", "Items"]}
        action={
          <Button onClick={openCreate}>
            <Plus /> Add Item
          </Button>
        }
      />

      <InventoryItemFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(initialFilters)}
        onColumns={() => setShowColumns((v) => !v)}
      />

      <InventoryItemsTableBase data={filteredItems} showColumns={showColumns} columns={columns} />

      <InventoryItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        defaultValues={editingItem ?? undefined}
        title={editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this item? This action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              <Trash2 className="mr-2 size-4" />
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
