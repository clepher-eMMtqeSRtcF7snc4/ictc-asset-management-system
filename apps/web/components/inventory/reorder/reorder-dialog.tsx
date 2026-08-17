"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { reorderItems } from "../types"
import type { ReorderItem } from "../types"

const reorderFormSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  suggestedQuantity: z.string().min(1, "Suggested quantity is required"),
  supplier: z.string().min(1, "Supplier is required"),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  remarks: z.string().optional(),
})

type FormValues = z.infer<typeof reorderFormSchema>

interface ReorderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => void
  defaultValues?: Partial<ReorderItem>
  title?: string
}

const suppliers = ["TechSource Philippines", "Datablitz Inc.", "HP Authorized Reseller", "CD-R King", "National Bookstore", "Epson Philippines"]

export function ReorderDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Reorder",
}: ReorderDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(reorderFormSchema),
    defaultValues: {
      itemId: "",
      suggestedQuantity: "",
      supplier: "",
      priority: "MEDIUM",
      remarks: "",
      ...defaultValues,
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label>Item</Label>
            <Select value={form.watch("itemId")} onValueChange={(value) => form.setValue("itemId", value)}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {reorderItems.map((item) => (
                  <SelectItem key={item.id} value={item.itemId}>
                    {item.sku} - {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.itemId && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.itemId.message}</p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Suggested Quantity</Label>
              <Input className="mt-1" type="number" {...form.register("suggestedQuantity")} />
              {form.formState.errors.suggestedQuantity && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.suggestedQuantity.message}</p>
              )}
            </div>
            <div>
              <Label>Supplier</Label>
              <Select value={form.watch("supplier")} onValueChange={(value) => form.setValue("supplier", value)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select supplier" />
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

          <div>
            <Label>Priority</Label>
            <Select value={form.watch("priority")} onValueChange={(value) => form.setValue("priority", value as "HIGH" | "MEDIUM" | "LOW")}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.priority && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.priority.message}</p>
            )}
          </div>

          <div>
            <Label>Remarks</Label>
            <Textarea className="mt-1" {...form.register("remarks")} placeholder="Optional remarks" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Reorder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
