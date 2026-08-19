"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { CreateBuildingInput, createBuildingInputSchema } from "@repo/trpc/schemas";

interface BuildingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateBuildingInput) => void;
  defaultValues?: CreateBuildingInput;
  title?: string;
}

export function BuildingDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Building",
}: BuildingDialogProps) {
  const form = useForm<CreateBuildingInput>({
    resolver: zodResolver(createBuildingInputSchema),
    defaultValues: defaultValues ?? {
      code: "",
      name: "",
      description: undefined,
      status: "active",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form id="location-form" className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-name">
                  Building Name
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  id="form-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter building name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-name">
                  Building Code
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  id="form-code"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter building code"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          
          <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      id="form-description"
                      placeholder="Enter description."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>
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
                <FieldLabel htmlFor="form-rhf-demo-status">
                  Status
                </FieldLabel>
                <Select
                  name={field.name}
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value as CreateBuildingInput["status"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectGroup>
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
              Close
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
