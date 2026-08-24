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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateEmployeeInput, createEmployeeInputSchema } from "@repo/trpc/schemas";
import FileUploadArea from "@/components/ui/file-upload-area";
import { getImageUrl } from "@/lib/image";
import Image from "next/image";
import { X } from "lucide-react";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateEmployeeInput) => void;
  defaultValues?: CreateEmployeeInput;
  title?: string;
  errorMessage?: string | null;
  onClearError?: () => void;
  departments: { id: number; name: string }[];
}

export function EmployeeDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  title = "Create Employee",
  errorMessage,
  onClearError,
  departments,
}: EmployeeDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const form = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeInputSchema),
    defaultValues: defaultValues ?? {
      firstName: "",
      middleName: null,
      lastName: "",
      email: "",
      position: "",
      designation: "",
      departmentId: 0,
      role: null,
      status: "active",
      photo: null,
    },
  });

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        form.reset(defaultValues);
        if (defaultValues.photo) {
          setPhotoPreview(getImageUrl(defaultValues.photo));
        } else {
          setPhotoPreview(null);
        }
      } else {
        form.reset({
          firstName: "",
          middleName: null,
          lastName: "",
          email: "",
          position: "",
          designation: "",
          departmentId: 0,
          role: null,
          status: "active",
          photo: null,
        });
        setPhotoPreview(null);
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
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPhotoPreview(null);
    form.setValue("photo", null);
  };

  const handleSubmitWithUpload = async (values: CreateEmployeeInput) => {
    let photoFilename = values.photo;

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
        photoFilename = filename;
      } catch (error) {
        console.error("Upload error:", error);
        return;
      } finally {
        setUploading(false);
      }
    }

    await onSubmit({
      ...values,
      photo: photoFilename,
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
        <form id="employee-form" className="grid gap-4" onSubmit={form.handleSubmit(handleSubmitWithUpload)}>
          <FieldGroup>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-firstName">First Name</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-firstName"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter first name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-lastName">Last Name</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-lastName"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter last name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter email address"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="position"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-position">Position</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-position"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter position"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="designation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-designation">Designation</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="form-designation"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter designation"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="departmentId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-department">Department</FieldLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="form-department" className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="photo"
              control={form.control}
              render={() => (
                <Field>
                  <FieldLabel>Photo</FieldLabel>
                  <div className="mt-2">
                    {photoPreview ? (
                      <div className="relative inline-block">
                        <Image
                          src={photoPreview}
                          unoptimized
                          alt="Employee photo preview"
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
