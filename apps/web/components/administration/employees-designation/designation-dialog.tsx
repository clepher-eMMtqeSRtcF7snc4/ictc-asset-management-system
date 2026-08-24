"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDesignationInputSchema, type CreateDesignationInput } from "@repo/trpc/schemas";

interface DesignationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateDesignationInput) => void;
  defaultValues?: CreateDesignationInput;
  title?: string;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export function DesignationDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Designation",
  errorMessage,
  onClearError,
}: DesignationDialogProps) {
  const form = useForm<CreateDesignationInput>({
    resolver: zodResolver(createDesignationInputSchema),
    defaultValues: defaultValues ?? {
      name: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        form.reset(defaultValues);
      } else {
        form.reset({
          name: "",
          status: "active",
        });
      }
    }
  }, [open, defaultValues, form]);

  const isEdit = Boolean(defaultValues);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 p-3 text-sm text-destructive"
          >
            {errorMessage}
          </p>
        )}
        <form
          id="designation-form"
          className="grid gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-designation-name">Designation Name</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-designation-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter designation name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-designation-status">Status</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as "active" | "inactive")}
                  >
                    <SelectTrigger id="form-designation-status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
