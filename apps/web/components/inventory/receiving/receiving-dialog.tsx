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
import { ReceivingItemsTable } from "./receiving-items-table"
import type { ReceivingRecord } from "../types"

const receivingFormSchema = z.object({
  receivedDate: z.string().min(1, "Date is required"),
  supplier: z.string().min(1, "Supplier is required"),
  purchaseOrderNo: z.string().min(1, "Purchase Order No. is required"),
  deliveryReceiptNo: z.string().min(1, "Delivery Receipt No. is required"),
  receivedBy: z.string().min(1, "Received By is required"),
  location: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof receivingFormSchema>

interface ReceivingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => void
  defaultValues?: Partial<ReceivingRecord>
  title?: string
}

const locations = ["ICT Stockroom A", "ICT Stockroom B", "Supply Room"]
const suppliers = ["TechSource Philippines", "Datablitz Inc.", "HP Authorized Reseller", "CD-R King", "National Bookstore", "Epson Philippines"]

export function ReceivingDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Receiving Record",
}: ReceivingDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(receivingFormSchema),
    defaultValues: {
      receivedDate: "",
      supplier: "",
      purchaseOrderNo: "",
      deliveryReceiptNo: "",
      receivedBy: "",
      location: "",
      notes: "",
      ...defaultValues,
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Receiving Date</Label>
              <Input className="mt-1" type="date" {...form.register("receivedDate")} />
              {form.formState.errors.receivedDate && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.receivedDate.message}</p>
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

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Purchase Order No.</Label>
              <Input className="mt-1" {...form.register("purchaseOrderNo")} />
              {form.formState.errors.purchaseOrderNo && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.purchaseOrderNo.message}</p>
              )}
            </div>
            <div>
              <Label>Delivery Receipt No.</Label>
              <Input className="mt-1" {...form.register("deliveryReceiptNo")} />
              {form.formState.errors.deliveryReceiptNo && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.deliveryReceiptNo.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Received By</Label>
              <Input className="mt-1" {...form.register("receivedBy")} />
              {form.formState.errors.receivedBy && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.receivedBy.message}</p>
              )}
            </div>
            <div>
              <Label>Location</Label>
              <Select value={form.watch("location")} onValueChange={(value) => form.setValue("location", value)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select location" />
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
          </div>

          <div>
            <Label>Remarks</Label>
            <Textarea className="mt-1" {...form.register("notes")} placeholder="Optional remarks" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Items</Label>
            <ReceivingItemsTable />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
