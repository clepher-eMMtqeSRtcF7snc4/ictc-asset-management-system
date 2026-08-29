"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
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
import { getImageUrl } from "@/lib/image";
import { Badge } from "@/components/ui/badge";

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
  1: ["serialNumber", "propertyNumber", "qrCode"],
  2: ["acquisitionDate", "acquisitionCost", "supportingDocs"],
  3: ["departmentId", "custodianId", "buildingId", "roomId"],
};

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
}: {
  step: number;
  onStepChange: (step: number) => void;
  onSubmit: (data: AssetRegistrationInput) => Promise<void> | void;
  isSubmitting?: boolean;
}) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<AssetRegistrationInput>({
    resolver: zodResolver(assetRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      assetName: "",
      brand: "",
      model: "",
      serialNumber: "",
      propertyNumber: "",
      qrCode: "",
      description: "",
      quantity: 1,
      assetPhoto: null,
      categoryId: undefined as unknown as number,
      assetTypeId: undefined as unknown as number,
      conditionId: undefined as unknown as number,
      acquisitionDate: undefined,
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

  const categoriesQuery = trpc.assetCategoryRouter.getCategories.useQuery(
    { status: "active" },
    {
      placeholderData: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    },
  );

  const assetTypesQuery = trpc.assetTypeRouter.getAssetTypes.useQuery(
    { status: "active" },
    {
      placeholderData: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    },
  );

  const conditionsQuery = trpc.assetConditionRouter.getAssetConditions.useQuery(
    { status: "active" },
    {
      placeholderData: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    },
  );

  const departmentsQuery = trpc.departmentRouter.getDepartments.useQuery(
    { status: "active" },
    {
      placeholderData: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    },
  );

  // const employeesQuery = trpc.employeeRouter.getEmployees.useQuery(
  //   { status: "active" },
  //   {
  //     placeholderData: {
  //       items: [],
  //       total: 0,
  //       page: 1,
  //       pageSize: 100,
  //       totalPages: 0,
  //     },
  //   },
  // );
  const employeesQuery = trpc.employeeRouter.getEmployees.useQuery(
    { pageSize: 100 },
  );

  const buildingsQuery = trpc.buildingRouter.getBuildings.useQuery(
    { status: "active" },
    {
      placeholderData: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    },
  );

  const roomsQuery = trpc.roomRouter.getRooms.useQuery(
    { status: "active" },
    {
      placeholderData: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    },
  );

  const categories = categoriesQuery.data?.items ?? [];
  const assetTypes = assetTypesQuery.data?.items ?? [];
  const conditions = conditionsQuery.data?.items ?? [];
  const departments = departmentsQuery.data?.items ?? [];
  // const employees = employeesQuery.data?.items ?? [];
  const buildings = buildingsQuery.data?.items ?? [];
  const rooms = roomsQuery.data?.items ?? [];
   const employees = (employeesQuery.data?.items ?? [])
    .filter((e) => e.status === "regular" || e.status === "permanent" || e.status === "contractual");
  const custodianOptions = employees.map((e) => ({
                      id: String(e.id),
                      name: `${e.lastName}, ${e.firstName}${e.middleName ? ` ${e.middleName[0]}.` : ""}`,
                      photoUrl: e.photo ? getImageUrl(e.photo) : null,
                      status: e.status,
                    }))

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
    form.setValue("assetPhoto", null);
  };

  const validateAndNext = async () => {
    const fields = STEP_FIELDS[step] ?? [];
    const result = await form.trigger(fields);
    if (result) {
      onStepChange(Math.min(step + 1, 4));
    }
  };

  const handleBack = () => {
    if (step === 0) {
      form.reset();
      clearSelection();
    }
    onStepChange(Math.max(step - 1, 0));
  };

  const handleFormSubmit = async (data: AssetRegistrationInput) => {
    console.log(data)
    await onSubmit(data);
  };

  return (
    <section className="rounded-md border p-4">
      <h2 className="font-semibold">{STEP_TITLES[step]}</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        {STEP_DESCRIPTIONS[step]}
      </p>

      <form
        id="asset-registration"
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid gap-6"
      >
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
                render={() => (
                  <Field>
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
                    </div>
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

            <Controller
              name="propertyNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property-number">
                    Property number *
                  </FieldLabel>
                  <Input
                   {...field}
                   value={field.value ?? ""}
                   onChange={(e) => field.onChange(e.target.value)}
                   id="property-number"
                   aria-invalid={fieldState.invalid}
                   placeholder="Enter property number"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="qrCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="qr-code">QR Code</FieldLabel>
                  <Input
                    id="qr-code"
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
                  <Input
                    id="supplier"
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter supplier"
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
                    renderOption={(option) => {
                    const status = (option as any).status;
                    const getVariant = (s: string): "success" | "info" | "warning" | "destructive" => {
                      if (s === "active" || s === "contractual" || s === "permanent") return "success";
                      if (s === "job-order" || s === "casual" || s === "temporary" || s === "probationary") return "info";
                      if (s === "on-leave") return "warning";
                      return "destructive";
                    };
                    return (
                      <div className="flex items-center gap-2">
                        {option.photoUrl ? (
                          <Image
                            src={option.photoUrl}
                            alt="Employee photo"
                            unoptimized
                            width={24}
                            height={24}
                            className="size-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                            {option.name.slice(0, 1)}
                          </div>
                        )}
                        <span className="flex-1">{option.name}</span>
                        <Badge variant={getVariant(status ?? "active")}>
                          {status === "active" ? "Regular" : status?.replace(/-/g, " ")}
                        </Badge>
                      </div>
                    );
                  }}
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
            {/* <p className="mb-3 text-sm font-semibold">Review & Confirm</p> */}
            <ReviewFields
              values={form.getValues()}
              categories={categories}
              assetTypes={assetTypes}
              conditions={conditions}
              departments={departments}
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
          <Button type="submit" form="asset-form" disabled={isSubmitting}>
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
  employees,
  buildings,
  rooms,
}: {
  values: AssetRegistrationInput;
  categories: { id: number; name: string }[];
  assetTypes: { id: number; name: string }[];
  conditions: { id: number; name: string }[];
  departments: { id: number; name: string }[];
  employees: { id: number; firstName: string; lastName: string }[];
  buildings: { id: number; name: string }[];
  rooms: { id: number; name: string }[];
}) {
  const getCustodianName = (id?: number) => {
    if (!id) return "—";
    const emp = employees.find((e) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : "—";
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
        ["Supplier", values.supplierId ? String(values.supplierId) : "—"],
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
