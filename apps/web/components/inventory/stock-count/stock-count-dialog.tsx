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
import { StockCountStepper } from "./stock-count-stepper"
import { StockCountItemsTable } from "./stock-count-items-table"
import type { StockCountRecord } from "../types"

const stockCountFormSchema = z.object({
  referenceNo: z.string().min(1, "Reference No. is required"),
  countDate: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  countedBy: z.string().min(1, "Counted By is required"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof stockCountFormSchema>

interface StockCountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => void
  defaultValues?: Partial<StockCountRecord>
  title?: string
}

const locations = ["ICT Stockroom A", "ICT Stockroom B", "Supply Room"]

export function StockCountDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Stock Count",
}: StockCountDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(stockCountFormSchema),
    defaultValues: {
      referenceNo: "",
      countDate: "",
      location: "",
      countedBy: "",
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
        <StockCountStepper />
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Count No.</Label>
              <Input className="mt-1" {...form.register("referenceNo")} />
              {form.formState.errors.referenceNo && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.referenceNo.message}</p>
              )}
            </div>
            <div>
              <Label>Date</Label>
              <Input className="mt-1" type="date" {...form.register("countDate")} />
              {form.formState.errors.countDate && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.countDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
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
            <div>
              <Label>Counted By</Label>
              <Input className="mt-1" {...form.register("countedBy")} />
              {form.formState.errors.countedBy && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.countedBy.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Remarks</Label>
            <Textarea className="mt-1" {...form.register("notes")} placeholder="Optional remarks" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Items</Label>
            <StockCountItemsTable />
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
