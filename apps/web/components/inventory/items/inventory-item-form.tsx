"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { InventoryItem } from "../types"

const inventoryItemFormSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  unitCost: z.string().min(1, "Unit cost is required"),
  quantity: z.string().min(1, "Quantity is required"),
  minStock: z.string().min(1, "Minimum stock is required"),
  location: z.string().min(1, "Location is required"),
  supplier: z.string().min(1, "Supplier is required"),
})

export type FormValues = z.infer<typeof inventoryItemFormSchema>

interface InventoryItemFormProps {
  form: ReturnType<typeof useForm<FormValues>>
  defaultValues?: Partial<InventoryItem>
}

const categories = ["Cables", "Adapters", "Toner", "Peripherals", "Storage", "Storage Media", "Components", "Supplies", "Ink"]
const units = ["pcs", "pack", "ream", "bottle", "box", "set"]
const locations = ["ICT Stockroom A", "ICT Stockroom B", "Supply Room"]
const suppliers = ["TechSource Philippines", "Datablitz Inc.", "HP Authorized Reseller", "CD-R King", "National Bookstore", "Epson Philippines"]

export function InventoryItemForm({ form }: InventoryItemFormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>SKU</Label>
          <Input className="mt-1 font-mono" {...form.register("sku")} />
          {form.formState.errors.sku && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.sku.message}</p>
          )}
        </div>
        <div>
          <Label>Item Name</Label>
          <Input className="mt-1" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea className="mt-1" {...form.register("description")} placeholder="Optional description of the item" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label>Category</Label>
          <Select value={form.watch("category")} onValueChange={(value) => form.setValue("category", value)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.category.message}</p>
          )}
        </div>
        <div>
          <Label>Unit</Label>
          <Select value={form.watch("unit")} onValueChange={(value) => form.setValue("unit", value)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.unit && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.unit.message}</p>
          )}
        </div>
        <div>
          <Label>Unit Cost (₱)</Label>
          <Input className="mt-1" type="number" {...form.register("unitCost")} />
          {form.formState.errors.unitCost && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.unitCost.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Quantity</Label>
          <Input className="mt-1" type="number" {...form.register("quantity")} />
          {form.formState.errors.quantity && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.quantity.message}</p>
          )}
        </div>
        <div>
          <Label>Minimum Stock Level</Label>
          <Input className="mt-1" type="number" {...form.register("minStock")} />
          {form.formState.errors.minStock && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.minStock.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Storage Location</Label>
          <Select value={form.watch("location")} onValueChange={(value) => form.setValue("location", value)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.location && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.location.message}</p>
          )}
        </div>
        <div>
          <Label>Supplier</Label>
          <Select value={form.watch("supplier")} onValueChange={(value) => form.setValue("supplier", value)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.supplier && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.supplier.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
