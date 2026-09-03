"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { trpc } from "@/lib/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import FileUploadArea from "@/components/ui/file-upload-area";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import {
  assetRegistrationSchema,
  type AssetRegistrationInput,
} from "@repo/trpc/schemas";
import Image from "next/image";

const STEP_FIELDS: Record<number, (keyof AssetRegistrationInput)[]> = {
  0: [
    "assetName",
    "categoryId",
    "assetTypeId",
    "brand",
    "model",
    "conditionId",
    "quantity",
  ],
  1: ["serialNumber"],
  2: ["acquisitionDate", "acquisitionCost", "supportingDocs"],
  3: ["departmentId", "custodianId", "buildingId", "roomId"],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const STEP_TITLES = [
  "Basic Information",
  "Identification",
  "Acquisition",
  "Location & Assignment",
  "Review & Confirm",
] as const;

const STEP_DESCRIPTIONS = [
  "Provide the basic details of the asset.",
  "Serial number, barcode, and asset identifiers.",
  "Purchase and financial information.",
  "Where the asset is located and who is responsible for it.",
  "Review the record before saving.",
] as const;

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function RegistrationStepPanel({
  step,
  onStepChange,
  onSubmit,
  isSubmitting = false,
  onFormValuesChange,
  onSupportingDocPreviewChange,
}: {
  step: number;
  onStepChange: (step: number) => void;
  onSubmit: (data: AssetRegistrationInput) => Promise<void> | void;
  isSubmitting?: boolean;
  onFormValuesChange?: (data: AssetRegistrationInput) => void;
  onSupportingDocPreviewChange?: (preview: string | null) => void;
}) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSupportingDocumentFile, setSelectedSupportingDocumentFile] =
    useState<File | null>(null);
  const [supportingDocPreview, setSupportingDocPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<AssetRegistrationInput>({
    resolver: zodResolver(
      assetRegistrationSchema,
    ) as Resolver<AssetRegistrationInput>,
    mode: "onChange",
    defaultValues: {
      assetName: "",
      brand: "",
      model: "",
      serialNumber: "",
      propertyNumber: undefined,
      qrCode: undefined,
      description: "",
      quantity: 1,
      assetPhoto: null,
      categoryId: undefined as unknown as number,
      assetTypeId: undefined as unknown as number,
      conditionId: undefined as unknown as number,
      acquisitionDate: new Date(),
      acquisitionCost: undefined,
      supplierId: undefined,
      purchaseOrderNumber: "",
      warranty: undefined,
      supportingDocs: "",
      departmentId: undefined as unknown as number,
      custodianId: undefined as unknown as number,
      buildingId: undefined,
      roomId: undefined,
    },
  });

  // Watch form values and notify parent for live sticker preview
  const onFormValuesChangeRef = useRef(onFormValuesChange);
  onFormValuesChangeRef.current = onFormValuesChange;

  const watchedAssetName = form.watch("assetName");
  const watchedModel = form.watch("model");
  const watchedSerialNumber = form.watch("serialNumber");
  const watchedAcquisitionDate = form.watch("acquisitionDate");
  const watchedAcquisitionCost = form.watch("acquisitionCost");
  const watchedPurchaseOrderNumber = form.watch("purchaseOrderNumber");
  const watchedCustodianId = form.watch("custodianId");
  const watchedAssetPhoto = form.watch("assetPhoto");
  const watchedSupportingDocs = form.watch("supportingDocs");

  useEffect(() => {
    onFormValuesChangeRef.current?.(form.getValues());
  }, [
    watchedAssetName,
    watchedModel,
    watchedSerialNumber,
    watchedAcquisitionDate,
    watchedAcquisitionCost,
    watchedPurchaseOrderNumber,
    watchedCustodianId,
    watchedAssetPhoto,
    watchedSupportingDocs,
  ]);

  useEffect(() => {
    onSupportingDocPreviewChange?.(supportingDocPreview);
  }, [supportingDocPreview, onSupportingDocPreviewChange]);

  const categoriesQuery = trpc.assetCategoryRouter.getActiveCategories.useQuery();
  const selectedCategoryId = form.watch("categoryId");
  const assetTypesQuery = trpc.assetTypeRouter.getActiveAssetTypes.useQuery(
    { assetCategoryId: selectedCategoryId },
    { enabled: selectedCategoryId !== undefined },
  );
  const conditionsQuery = trpc.assetConditionRouter.getActiveAssetConditions.useQuery();
  const departmentsQuery = trpc.departmentRouter.getActiveDepartments.useQuery();
  const suppliersQuery = trpc.supplierRouter.getActiveSuppliers.useQuery();
  const selectedDepartmentId = form.watch("departmentId");
  const employeesQuery = trpc.employeeRouter.getActiveEmployees.useQuery(
    { departmentId: selectedDepartmentId },
    { enabled: selectedDepartmentId !== undefined },
  );
  const buildingsQuery = trpc.buildingRouter.getActiveBuildings.useQuery();
  const selectedBuildingId = form.watch("buildingId");
  const roomsQuery = trpc.roomRouter.getActiveRooms.useQuery(
    { buildingId: selectedBuildingId },
    { enabled: selectedBuildingId !== undefined },
  );

  const categories = categoriesQuery.data ?? [];
  const assetTypes = assetTypesQuery.data ?? [];
  const conditions = conditionsQuery.data ?? [];
  const departments = departmentsQuery.data ?? [];
  const suppliers = suppliersQuery.data ?? [];
  const employees = selectedDepartmentId === undefined ? [] : (employeesQuery.data ?? []);
  const buildings = buildingsQuery.data ?? [];
  const rooms = selectedBuildingId === undefined ? [] : (roomsQuery.data ?? []);

  const custodianOptions = employees.map((e) => ({
    id: String(e.id),
    name: e.name,
  }));

  const selectedDepartment = departments.find(
    (d) => d.id === selectedDepartmentId,
  );
  const departmentCode = selectedDepartment?.code ?? "—";

  useEffect(() => {
    if (
      selectedCategoryId === undefined ||
      form.getValues("assetTypeId") === undefined
    ) {
      return;
    }

    const currentAssetTypeIsValid = assetTypes.some(
      (assetType) => assetType.id === form.getValues("assetTypeId"),
    );

    if (!currentAssetTypeIsValid) {
      form.setValue("assetTypeId", undefined as unknown as number);
    }
  }, [assetTypes, form, selectedCategoryId]);

  useEffect(() => {
    if (
      selectedDepartmentId === undefined ||
      form.getValues("custodianId") === undefined
    ) {
      return;
    }

    const currentCustodianIsValid = employees.some(
      (employee) => employee.id === form.getValues("custodianId"),
    );

    if (!currentCustodianIsValid) {
      form.setValue("custodianId", undefined as unknown as number);
    }
  }, [employees, form, selectedDepartmentId]);

  useEffect(() => {
    if (
      selectedBuildingId === undefined ||
      form.getValues("roomId") === undefined
    ) {
      return;
    }

    const currentRoomIsValid = rooms.some(
      (room) => room.id === form.getValues("roomId"),
    );

    if (!currentRoomIsValid) {
      form.setValue("roomId", undefined as unknown as number);
    }
  }, [form, rooms, selectedBuildingId]);

const validateSupportingDocument = (file: File | null) => {
    if (!file) {
      form.setError("supportingDocs", {
        type: "manual",
        message: "Supporting document is required.",
      });
      return false;
    }

    if (file.type !== "application/pdf") {
      form.setError("supportingDocs", {
        type: "manual",
        message: "Only PDF files are allowed.",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      form.setError("supportingDocs", {
        type: "manual",
        message: `File size exceeds 5MB. Selected file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      });
      return false;
    }

    form.clearErrors("supportingDocs");
    return true;
  };

  const handleFileSelect = (file: File) => {
     if (file && file.type.startsWith("image/")) {
       if (file.size > MAX_FILE_SIZE) {
         form.setError("assetPhoto", {
           type: "manual",
           message: `File size exceeds 5MB. Selected file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
         });
         setPhotoPreview(null);
         setSelectedFile(null);
         form.setValue("assetPhoto", null);
         return;
       }
       form.clearErrors("assetPhoto");
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
     form.setValue("assetPhoto", null);
     clearSupportingDoc();
   };

   const clearSupportingDoc = () => {
     setSelectedSupportingDocumentFile(null);
     setSupportingDocPreview(null);
     form.setValue("supportingDocs", "");
   };

  const uploadFile = async (
    file: File,
    endpoint: "/api/upload/image" | "/api/upload/document",
    fieldName: "image" | "document",
  ) => {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        endpoint === "/api/upload/image"
          ? "Failed to upload asset photo."
          : "Failed to upload supporting document.",
      );
    }

    const payload = await response.json();
    const uploadedValue =
      payload?.path ?? payload?.filename ?? payload?.url ?? "";
    const normalizedValue = uploadedValue
      .toString()
      .replace(/\\/g, "/")
      .replace(/^\/+/, "")
      .replace(/^uploads\//i, "");

    if (!normalizedValue || !/^(images|documents)\//i.test(normalizedValue)) {
      throw new Error("Uploaded file path was not returned by the server.");
    }

    return normalizedValue as string;
  };

const validateAndNext = async () => {
     if (step === 2) {
       const isSupportingDocumentValid =
         validateSupportingDocument(selectedSupportingDocumentFile);
       if (!isSupportingDocumentValid) {
         return;
       }
     }

     if (step === 0 && selectedFile && selectedFile.size > MAX_FILE_SIZE) {
       form.setError("assetPhoto", {
         type: "manual",
         message: `File size exceeds 5MB. Selected file is ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB.`,
       });
       return;
     }

     const fields = STEP_FIELDS[step] ?? [];
     const result = await form.trigger(fields);
     if (!result) {
       return;
     }

     onStepChange(Math.min(step + 1, 4));
   };

  const handleBack = () => {
    if (step === 0) {
      form.reset();
      clearSelection();
    }
    onStepChange(Math.max(step - 1, 0));
  };

  const handleSubmitWithUpload = async (data: AssetRegistrationInput) => {
    let assetPhotoFilename = data.assetPhoto ?? null;
    let supportingDocsFilename = data.supportingDocs ?? "";

    try {
      setIsUploading(true);

      if (selectedFile) {
        assetPhotoFilename = await uploadFile(
          selectedFile,
          "/api/upload/image",
          "image",
        );
      }

      if (selectedSupportingDocumentFile) {
        supportingDocsFilename = await uploadFile(
          selectedSupportingDocumentFile,
          "/api/upload/document",
          "document",
        );
      }

      await onSubmit({
        ...data,
        assetPhoto: assetPhotoFilename,
        supportingDocs: supportingDocsFilename,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return;
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setSelectedSupportingDocumentFile(null);
    }
  };

  return (
    <section className="rounded-md border p-4">
      <h2 className="font-semibold">{STEP_TITLES[step]}</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        {STEP_DESCRIPTIONS[step]}
      </p>

      <form id="asset-registration" className="grid gap-6">
        {step === 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FieldGroup className="space-y-2">
              <Controller
                name="assetName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="asset-name">Asset name *</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      id="asset-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter asset name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="category">Category *</FieldLabel>
                    <Combobox
                      options={categories.map((c) => ({
                        id: String(c.id),
                        name: c.name,
                      }))}
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) =>
                        field.onChange(value ? Number(value) : undefined)
                      }
                      placeholder="Select category"
                      fullWidth
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="assetTypeId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="asset-type">Asset type *</FieldLabel>
                    <Combobox
                      options={assetTypes.map((t) => ({
                        id: String(t.id),
                        name: t.name,
                      }))}
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) =>
                        field.onChange(value ? Number(value) : undefined)
                      }
                      placeholder="Select asset type"
                      fullWidth
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="brand"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="brand">Brand *</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      id="brand"
                      placeholder="Enter brand"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="model"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="model">Model *</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      id="model"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter model"
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
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      className="min-h-16"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="space-y-2">
              <Controller
                name="conditionId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="condition">Condition *</FieldLabel>
                    <Combobox
                      options={conditions.map((c) => ({
                        id: String(c.id),
                        name: c.name,
                      }))}
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(value) =>
                        field.onChange(value ? Number(value) : undefined)
                      }
                      placeholder="Select condition"
                      fullWidth
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="quantity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="quantity">Quantity *</FieldLabel>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      value={field.value ?? 1}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : 1,
                        )
                      }
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="assetPhoto"
                control={form.control}
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Asset Photo</FieldLabel>
                    <div className="mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center">
                      {photoPreview ? (
                        <div className="relative inline-block">
                          <Image
                            src={photoPreview}
                            unoptimized
                            alt="Asset photo preview"
                            width={50}
                            height={50}
                            className="size-50 rounded-md border object-fit"
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
                      {isUploading && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Uploading asset files...
                        </p>
                      )}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Controller
              name="serialNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="serial-number">
                    Serial number *
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    id="serial-number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter serial number"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="rounded-md border border-dashed bg-muted/30 p-4 md:col-span-2">
              <p className="text-sm font-medium text-foreground">
                Property number
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Format: YYYY-MM-DD-
                <span className="font-mono">{departmentCode}</span>-NNN
              </p>
              <p className="mt-2 text-sm font-mono text-foreground">
                Preview:{" "}
                {form.getValues("departmentId")
                  ? `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}-${departmentCode}-001`
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Final number assigned after save.
              </p>

              <p className="mt-4 text-sm font-medium text-foreground">
                QR code
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Automatically generated after save and linked to the asset
                record.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Controller
              name="acquisitionDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="acquisition-date">
                    Acquisition date *
                  </FieldLabel>
                  <Input
                    id="acquisition-date"
                    type="date"
                    value={
                      field.value
                        ? formatDateForInput(new Date(field.value))
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      field.onChange(date);
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="acquisitionCost"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="acquisition-cost">
                    Acquisition cost *
                  </FieldLabel>
                  <Input
                    id="acquisition-cost"
                    type="number"
                    min={0}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter acquisition cost"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="supplierId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="supplier">Supplier</FieldLabel>
                  <Combobox
                    options={suppliers.map((supplier) => ({
                      id: String(supplier.id),
                      name: supplier.name,
                    }))}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    placeholder="Select supplier"
                    fullWidth
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="purchaseOrderNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="po-number">
                    Purchase order number
                  </FieldLabel>
                  <Input
                    id="po-number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter PO number"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="warranty"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="warranty">Warranty (years)</FieldLabel>
                  <Input
                    id="warranty"
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter number of years"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="supportingDocs"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="supporting-docs">
                    Supporting documents *
                  </FieldLabel>
                  
<Input
                      id="supporting-docs"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;

                        setSelectedSupportingDocumentFile(null);
                        setSupportingDocPreview(null);
                        field.onChange("");

                        if (!file) {
                          form.clearErrors("supportingDocs");
                          return;
                        }

                        if (!validateSupportingDocument(file)) {
                          e.target.value = "";
                          return;
                        }

                        setSelectedSupportingDocumentFile(file);
                        field.onChange(file.name);

                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setSupportingDocPreview(ev.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }}
                      aria-invalid={fieldState.invalid}
                      className="file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      PDF files must not exceed 5MB.
                    </p>

                   {field.value ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Selected file: {field.value}
                    </p>
                  ) : null}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Controller
              name="departmentId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="department">Department *</FieldLabel>
                  <Combobox
                    options={departments.map((d) => ({
                      id: String(d.id),
                      name: d.name,
                    }))}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    placeholder="Select department"
                    fullWidth
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="custodianId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="custodian">Assigned to *</FieldLabel>
                  <Combobox
                    options={custodianOptions}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    placeholder="Select custodian"
                    fullWidth
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="buildingId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="building">Building</FieldLabel>
                  <Combobox
                    options={buildings.map((b) => ({
                      id: String(b.id),
                      name: b.name,
                    }))}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    placeholder="Select building"
                    fullWidth
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="roomId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="room">Room</FieldLabel>
                  <Combobox
                    options={rooms.map((r) => ({
                      id: String(r.id),
                      name: r.name,
                    }))}
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    placeholder="Select room"
                    fullWidth
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        )}

        {step === 4 && (
          <div className="md:col-span-2">
            <ReviewFields
              values={form.getValues()}
              categories={categories}
              assetTypes={assetTypes}
              conditions={conditions}
              departments={departments}
              suppliers={suppliers}
              employees={employees}
              buildings={buildings}
              rooms={rooms}
            />
          </div>
        )}
      </form>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <Button type="button" variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 size-4" />
          {step === 0 ? "Cancel" : "Back"}
        </Button>
        {step < 4 ? (
          <Button type="button" onClick={validateAndNext}>
            Next <ArrowRight className="ml-2 size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => form.handleSubmit(handleSubmitWithUpload)()}
          >
            <Save className="mr-2 size-4" />
            {isSubmitting ? "Saving…" : "Save asset"}
          </Button>
        )}
      </div>
    </section>
  );
}

function ReviewFields({
  values,
  categories,
  assetTypes,
  conditions,
  departments,
  suppliers,
  employees,
  buildings,
  rooms,
}: {
  values: AssetRegistrationInput;
  categories: { id: number; name: string }[];
  assetTypes: { id: number; name: string }[];
  conditions: { id: number; name: string }[];
  departments: { id: number; name: string }[];
  suppliers: { id: number; name: string }[];
  employees: { id: number; name: string }[];
  buildings: { id: number; name: string }[];
  rooms: { id: number; name: string }[];
}) {
  const getCustodianName = (id?: number) => {
    if (!id) return "—";
    const emp = employees.find((e) => e.id === id);
    return emp ? emp.name : "—";
  };

  const getSupplierName = (id?: number) => {
    if (!id) return "—";
    const supplier = suppliers.find((s) => s.id === id);
    return supplier ? supplier.name : "—";
  };

  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      {[
        ["Asset name", values.assetName],
        ["Brand / model", `${values.brand} / ${values.model}`],
        [
          "Category",
          categories.find((c) => c.id === values.categoryId)?.name ?? "—",
        ],
        [
          "Asset type",
          assetTypes.find((t) => t.id === values.assetTypeId)?.name ?? "—",
        ],
        [
          "Condition",
          conditions.find((c) => c.id === values.conditionId)?.name ?? "—",
        ],
        ["Quantity", String(values.quantity ?? "—")],
        ["Serial number", values.serialNumber ?? "—"],
        ["Property number", values.propertyNumber ?? "—"],
        ["Description", values.description || "—"],
        [
          "Acquisition date",
          values.acquisitionDate
            ? new Date(values.acquisitionDate).toLocaleDateString()
            : "—",
        ],
        [
          "Acquisition cost",
          values.acquisitionCost != null
            ? `PHP ${values.acquisitionCost}`
            : "—",
        ],
        [
          "Department",
          departments.find((d) => d.id === values.departmentId)?.name ?? "—",
        ],
        ["Custodian", getCustodianName(values.custodianId)],
        [
          "Building",
          buildings.find((b) => b.id === values.buildingId)?.name ?? "—",
        ],
        ["Room", rooms.find((r) => r.id === values.roomId)?.name ?? "—"],
        ["Supplier", getSupplierName(values.supplierId)],
        ["Purchase order", values.purchaseOrderNumber || "—"],
        ["Warranty", values.warranty || "—"],
        ["Supporting docs", values.supportingDocs || "—"],
      ].map(([key, value]) => (
        <div key={key}>
          <dt className="text-xs text-muted-foreground">{key as string}</dt>
          <dd className="font-medium">{value as string}</dd>
        </div>
      ))}
    </dl>
  );
}
