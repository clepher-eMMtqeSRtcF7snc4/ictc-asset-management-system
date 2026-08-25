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
import { Combobox } from "@/components/ui/combobox";
import { CreateEmployeeInput, createEmployeeInputSchema } from "@repo/trpc/schemas";
import FileUploadArea from "@/components/ui/file-upload-area";
import { getImageUrl } from "@/lib/image";
import Image from "next/image";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

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

  const positionsQuery = trpc.positionRouter.getPositions.useQuery(
    { status: "active", pageSize: 100 },
    { enabled: open }
  );

  const designationsQuery = trpc.designationRouter.getDesignations.useQuery(
    { status: "active", pageSize: 100 },
    { enabled: open }
  );

  const positions = positionsQuery.data?.items ?? [];
  const designations = designationsQuery.data?.items ?? [];

  const statusOptions = [
    { id: "active", name: "Active" },
    { id: "casual", name: "Casual" },
    { id: "contractual", name: "Contractual" },
    { id: "deceased", name: "Deceased" },
    { id: "end-of-contract", name: "End of Contract" },
    { id: "inactive", name: "Inactive" },
    { id: "on-leave", name: "On Leave" },
    { id: "permanent", name: "Permanent" },
    { id: "probationary", name: "Probationary" },
    { id: "retired", name: "Retired" },
    { id: "suspended", name: "Suspended" },
    { id: "temporary", name: "Temporary" },
    { id: "terminated", name: "Terminated" },
  ];

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

  const isEdit = Boolean(defaultValues);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
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
        <form id="employee-form" className="grid gap-6" onSubmit={form.handleSubmit(handleSubmitWithUpload)}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column: Personal & Job Info */}
            <FieldGroup className="space-y-2">
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
                name="middleName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-middleName">Middle Name (Optional)</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      id="form-middleName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter middle name"
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
                    <Combobox
                      options={positions}
                      value={field.value ?? ""}
                      onValueChange={(value) => field.onChange(value)}
                      placeholder="Select position"
                      className="w-full"
                      fullWidth
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
                    <Combobox
                      options={designations}
                      value={field.value ?? ""}
                      onValueChange={(value) => field.onChange(value)}
                      placeholder="Select designation"
                      className="w-full"
                      fullWidth
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Right Column: Photo & Department Assignments */}
            <div className="space-y-4">
              <Controller
                name="departmentId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-department">Primary Department</FieldLabel>
                    <Combobox
                      options={departments.map((d) => ({ id: String(d.id), name: d.name }))}
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                      placeholder="Select primary department"
                      className="w-full"
                      fullWidth
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {isEdit && (
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-status">Status</FieldLabel>
                      <Combobox
                        options={statusOptions}
                        value={field.value ?? "active"}
                        onValueChange={(value) => field.onChange(value as any)}
                        placeholder="Select status"
                        className="w-full"
                        fullWidth
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}

              <Controller
                name="photo"
                control={form.control}
                render={() => (
                  <Field>
                    <FieldLabel>Photo</FieldLabel>
                    <div className="mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center">
                      {photoPreview ? (
                        <div className="relative inline-block">
                          <Image
                            src={photoPreview}
                            unoptimized
                            alt="Employee photo preview"
                            width={112}
                            height={112}
                            className="size-28 rounded-md border object-cover"
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
                          Uploading photo...
                        </p>
                      )}
                    </div>
                  </Field>
                )}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
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
