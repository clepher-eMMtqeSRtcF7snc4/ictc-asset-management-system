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
import { createPositionInputSchema, type CreatePositionInput } from "@repo/trpc/schemas";

interface PositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreatePositionInput) => void;
  defaultValues?: CreatePositionInput;
  title?: string;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export function PositionDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Position",
  errorMessage,
  onClearError,
}: PositionDialogProps) {
  const form = useForm<CreatePositionInput>({
    resolver: zodResolver(createPositionInputSchema),
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
          id="position-form"
          className="grid gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-position-name">Position Name</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-position-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter position name"
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
                  <FieldLabel htmlFor="form-position-status">Status</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as "active" | "inactive")}
                  >
                    <SelectTrigger id="form-position-status" className="w-full">
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
