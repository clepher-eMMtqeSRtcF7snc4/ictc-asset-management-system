"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { custodianFormSchema } from "./custodian-form-schema";
import type { CustodianFormValues } from "./custodian-form-schema";

interface CustodianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CustodianFormValues) => void;
  defaultValues?: CustodianFormValues;
  title?: string;
}

export function CustodianDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Custodian",
}: CustodianDialogProps) {
  const form = useForm<CustodianFormValues>({
    resolver: zodResolver(custodianFormSchema),
    defaultValues: defaultValues ?? {
      employeeId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      position: "",
      department: "",
      office: "",
      status: "active",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Employee ID</Label>
              <Input className="mt-1" {...form.register("employeeId")} />
              {form.formState.errors.employeeId && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.employeeId.message}
                </p>
              )}
            </div>
            <div>
              <Label>First Name</Label>
              <Input className="mt-1" {...form.register("firstName")} />
              {form.formState.errors.firstName && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Middle Name</Label>
              <Input className="mt-1" {...form.register("middleName")} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input className="mt-1" {...form.register("lastName")} />
              {form.formState.errors.lastName && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Position</Label>
              <Input className="mt-1" {...form.register("position")} />
              {form.formState.errors.position && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.position.message}
                </p>
              )}
            </div>
            <div>
              <Label>Department</Label>
              <Input className="mt-1" {...form.register("department")} />
              {form.formState.errors.department && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.department.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label>Office</Label>
            <Input className="mt-1" {...form.register("office")} />
            {form.formState.errors.office && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.office.message}
              </p>
            )}
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) => form.setValue("status", value as CustodianFormValues["status"])}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
