"use client";

import { useEffect, useState } from "react";
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
import { CreateDepartmentInput, createDepartmentInputSchema } from "@repo/trpc/schemas";
import FileUploadArea from "@/components/ui/file-upload-area";
import { getImageUrl } from "@/lib/image";
import Image from "next/image";
import { X } from "lucide-react";

interface DepEmpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateDepartmentInput) => void;
  defaultValues?: CreateDepartmentInput;
  title?: string;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export function DepEmpDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Department",
  errorMessage,
  onClearError,
}: DepEmpDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const form = useForm<CreateDepartmentInput>({
    resolver: zodResolver(createDepartmentInputSchema),
    defaultValues: defaultValues ?? {
      name: "",
      code: "",
      description: "",
      supervisorId: null,
      custodianId: null,
      logo: null,
      color: null,
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      form.reset(defaultValues);
      if (defaultValues.logo) {
        setLogoPreview(getImageUrl(defaultValues.logo));
      } else {
        setLogoPreview(null);
      }
    }
  }, [open, defaultValues, form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (errorMessage) onClearError?.();
    });
    return () => subscription.unsubscribe();
  }, [form, errorMessage, onClearError]);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setLogoPreview(null);
    form.setValue("logo", null);
  };

  const handleSubmitWithUpload = async (values: CreateDepartmentInput) => {
    let logoFilename = values.logo;

    if (selectedFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const uploadResponse = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const { filename } = await uploadResponse.json();
        logoFilename = filename;
      } catch (error) {
        console.error("Upload error:", error);
        return;
      } finally {
        setUploading(false);
      }
    }

    await onSubmit({
      ...values,
      logo: logoFilename,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
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
        <form id="department-form" className="grid gap-4" onSubmit={form.handleSubmit(handleSubmitWithUpload)}>
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-code">Code</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-code"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter department code"
                    autoComplete="off"
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
                  <FieldLabel htmlFor="form-name">Department Name</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter department name"
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
                  <FieldLabel htmlFor="form-description">Description</FieldLabel>
                  <textarea
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter department description"
                    autoComplete="off"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="color"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-color">Color</FieldLabel>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      {...field}
                      value={field.value ?? "#000000"}
                      onChange={(e) => field.onChange(e.target.value)}
                      id="form-color"
                      className="size-9 cursor-pointer rounded-md border border-input bg-transparent p-1"
                    />
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="#16a34a"
                      autoComplete="off"
                      className="flex-1"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="logo"
              control={form.control}
              render={() => (
                <Field>
                  <FieldLabel>Logo</FieldLabel>
                  <div className="mt-2">
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <Image
                          src={logoPreview}
                          unoptimized
                          alt="Department logo preview"
                          width={96}
                          height={96}
                          className="size-24 rounded-md object-cover border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-xs"
                          className="absolute -top-2 -right-2"
                          onClick={clearSelection}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUploadArea onFileSelect={handleFileSelect} />
                    )}
                    {uploading && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Uploading...
                      </p>
                    )}
                  </div>
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
            <Button type="submit" disabled={uploading || form.formState.isSubmitting}>
              {uploading || form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
