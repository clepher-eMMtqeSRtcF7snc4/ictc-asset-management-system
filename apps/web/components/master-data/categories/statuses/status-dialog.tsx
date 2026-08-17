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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { statusFormSchema } from "./status-form-schema";
import type { StatusFormValues } from "./status-form-schema";

interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StatusFormValues) => void;
  defaultValues?: StatusFormValues;
  title?: string;
}

export function StatusDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Status",
}: StatusDialogProps) {
  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: defaultValues ?? {
      code: "",
      name: "",
      description: "",
      statusType: "",
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
              <Label>Status Code</Label>
              <Input className="mt-1" {...form.register("code")} />
              {form.formState.errors.code && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.code.message}
                </p>
              )}
            </div>
            <div>
              <Label>Status Name</Label>
              <Input className="mt-1" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea className="mt-1" {...form.register("description")} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Status Type</Label>
              <Input className="mt-1" {...form.register("statusType")} />
              {form.formState.errors.statusType && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.statusType.message}
                </p>
              )}
            </div>
            <div>
              <Label>State</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value) => form.setValue("status", value as StatusFormValues["status"])}
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
