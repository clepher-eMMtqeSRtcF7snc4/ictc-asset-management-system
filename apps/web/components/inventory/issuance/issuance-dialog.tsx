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
import { IssuanceItemsTable } from "./issuance-items-table"
import type { IssuanceRecord } from "../types"

const issuanceFormSchema = z.object({
  issuedDate: z.string().min(1, "Date is required"),
  requester: z.string().min(1, "Requestor is required"),
  department: z.string().min(1, "Department is required"),
  purpose: z.string().min(1, "Purpose is required"),
  issuedBy: z.string().min(1, "Issued By is required"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof issuanceFormSchema>

interface IssuanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FormValues) => void
  defaultValues?: Partial<IssuanceRecord>
  title?: string
}

const departments = ["College of Computing", "Engineering", "Administration", "Accounting", "ICT", "Library", "IT Support Desk"]

export function IssuanceDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Issuance Record",
}: IssuanceDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(issuanceFormSchema),
    defaultValues: {
      issuedDate: "",
      requester: "",
      department: "",
      purpose: "",
      issuedBy: "",
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
              <Label>Request Date</Label>
              <Input className="mt-1" type="date" {...form.register("issuedDate")} />
              {form.formState.errors.issuedDate && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.issuedDate.message}</p>
              )}
            </div>
            <div>
              <Label>Requestor</Label>
              <Input className="mt-1" {...form.register("requester")} />
              {form.formState.errors.requester && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.requester.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Department</Label>
              <Select value={form.watch("department")} onValueChange={(value) => form.setValue("department", value)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.department && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.department.message}</p>
              )}
            </div>
            <div>
              <Label>Issued By</Label>
              <Input className="mt-1" {...form.register("issuedBy")} />
              {form.formState.errors.issuedBy && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.issuedBy.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Purpose</Label>
            <Textarea className="mt-1" {...form.register("purpose")} />
            {form.formState.errors.purpose && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.purpose.message}</p>
            )}
          </div>

          <div>
            <Label>Remarks</Label>
            <Textarea className="mt-1" {...form.register("notes")} placeholder="Optional remarks" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Items</Label>
            <IssuanceItemsTable />
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
