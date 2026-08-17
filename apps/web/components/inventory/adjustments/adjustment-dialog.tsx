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
import type { AdjustmentRecord } from "../types"

const adjustmentFormSchema = z.object({
  referenceNo: z.string().min(1, "Reference No. is required"),
  adjustmentDate: z.string().min(1, "Date is required"),
  type: z.enum(["INCREASE", "DECREASE"]),
  reason: z.string().min(1, "Reason is required"),
  reference: z.string().optional(),
  adjustedBy: z.string().min(1, "Performed By is required"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof adjustmentFormSchema>

interface AdjustmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => void
  defaultValues?: Partial<AdjustmentRecord>
  title?: string
}

const reasons = [
  "Physical Count Discrepancy",
  "Damaged Items",
  "Expired Items",
  "Data Entry Correction",
  "Found Stock",
  "Other",
]

export function AdjustmentDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Adjustment Record",
}: AdjustmentDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(adjustmentFormSchema),
    defaultValues: {
      referenceNo: "",
      adjustmentDate: "",
      type: "INCREASE",
      reason: "",
      reference: "",
      adjustedBy: "",
      notes: "",
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
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Adjustment No.</Label>
              <Input className="mt-1" {...form.register("referenceNo")} />
              {form.formState.errors.referenceNo && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.referenceNo.message}</p>
              )}
            </div>
            <div>
              <Label>Date</Label>
              <Input className="mt-1" type="date" {...form.register("adjustmentDate")} />
              {form.formState.errors.adjustmentDate && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.adjustmentDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Adjustment Type</Label>
              <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value as "INCREASE" | "DECREASE")}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCREASE">Increase</SelectItem>
                  <SelectItem value="DECREASE">Decrease</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.type.message}</p>
              )}
            </div>
            <div>
              <Label>Performed By</Label>
              <Input className="mt-1" {...form.register("adjustedBy")} />
              {form.formState.errors.adjustedBy && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.adjustedBy.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Reason</Label>
            <Select value={form.watch("reason")} onValueChange={(value) => form.setValue("reason", value)}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.reason && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.reason.message}</p>
            )}
          </div>

          <div>
            <Label>Reference</Label>
            <Input className="mt-1" {...form.register("reference")} />
          </div>

          <div>
            <Label>Remarks</Label>
            <Textarea className="mt-1" {...form.register("notes")} placeholder="Optional remarks" />
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
