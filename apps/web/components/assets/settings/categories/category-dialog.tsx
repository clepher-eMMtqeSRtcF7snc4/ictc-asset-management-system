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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateCategoryInput, createCategoryInputSchema } from "@repo/trpc/schemas";  
import { useEffect } from "react";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateCategoryInput) => void;
  defaultValues?: CreateCategoryInput;
  title?: string;
}

export function CategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Category",
}: CategoryDialogProps) {
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategoryInputSchema),
    defaultValues: defaultValues ?? {
      code: "",
      name: "",
      description: "",
      type: "",
      depreciable: false,
      defaultUsefulLife: null,
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
<form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-code">Category Code</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  id="form-code"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter category code"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-name">Category Name</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  id="form-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter category name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-description">Description</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                id="form-description"
                aria-invalid={fieldState.invalid}
                placeholder="Enter description"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <FieldGroup>
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-type">
                  Asset Type
                </FieldLabel>

                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-type"
                    className="mt-1 w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Asset">Asset</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="defaultUsefulLife"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-defaultUsefulLife">Default Useful Life (years)</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    field.onChange(e.target.value === "" ? null : Number(e.target.value));
                  }}
                  id="form-defaultUsefulLife"
                  type="number"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter useful life"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Controller
          name="depreciable"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="form-depreciable"
                  checked={field.value ?? false}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  aria-invalid={fieldState.invalid}
                />
                <Label htmlFor="form-depreciable" className="text-sm font-normal">
                  Depreciable
                </Label>
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

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
