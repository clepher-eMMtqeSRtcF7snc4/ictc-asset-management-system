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
import { Checkbox } from "@/components/ui/checkbox";
import { categoryFormSchema } from "./category-form-schema";
import type { CategoryFormValues } from "./category-form-schema";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CategoryFormValues) => void;
  defaultValues?: CategoryFormValues;
  title?: string;
}

export function CategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Category",
}: CategoryDialogProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: defaultValues ?? {
      code: "",
      name: "",
      description: "",
      type: "",
      depreciable: false,
      defaultUsefulLife: null,
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
              <Label>Category Code</Label>
              <Input className="mt-1" {...form.register("code")} />
              {form.formState.errors.code && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.code.message}
                </p>
              )}
            </div>
            <div>
              <Label>Category Name</Label>
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
              <Label>Asset Type</Label>
              <Select
                value={form.watch("type")}
                onValueChange={(value) => form.setValue("type", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asset">Asset</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>
            <div>
              <Label>Default Useful Life (years)</Label>
              <Input
                className="mt-1"
                type="number"
                {...form.register("defaultUsefulLife", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="depreciable"
              checked={form.watch("depreciable")}
              onCheckedChange={(checked) => form.setValue("depreciable", checked === true)}
            />
            <Label htmlFor="depreciable" className="text-sm font-normal">
              Depreciable
            </Label>
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) => form.setValue("status", value as CategoryFormValues["status"])}
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
