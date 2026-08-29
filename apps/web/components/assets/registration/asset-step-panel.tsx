"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import {
  assetRegistrationSchema,
  type AssetRegistrationInput,
} from "@repo/trpc/schemas";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

const STEP_FIELDS: Record<number, (keyof AssetRegistrationInput)[]> = {
  0: ["assetName", "categoryId", "assetTypeId", "brand", "model", "conditionId", "quantity"],
  1: ["serialNumber"],
  2: ["acquisitionDate", "acquisitionCost", "supportingDocs"],
  3: ["departmentId", "custodianId"],
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
  const form = useForm<AssetRegistrationInput>({
    resolver: zodResolver(assetRegistrationSchema),
    defaultValues: {
      assetName: "",
      brand: "",
      model: "",
      serialNumber: "",
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
      warranty: "",
      supportingDocs: "",
      departmentId: undefined as unknown as number,
      custodianId: undefined as unknown as number,
      buildingId: undefined,
      roomId: undefined,
    },
  });

  const categoriesQuery = trpc.assetCategoryRouter.getCategories.useQuery(
    { status: "active" },
    { placeholderData: { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 } }
  );

  const assetTypesQuery = trpc.assetTypeRouter.getAssetTypes.useQuery(
    { status: "active" },
    { placeholderData: { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 } }
  );

  const conditionsQuery = trpc.assetConditionRouter.getAssetConditions.useQuery(
    { status: "active" },
    { placeholderData: { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 } }
  );

  const departmentsQuery = trpc.departmentRouter.getDepartments.useQuery(
    { status: "active" },
    { placeholderData: { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 } }
  );

  const employeesQuery = trpc.employeeRouter.getEmployees.useQuery(
    { status: "active" },
    { placeholderData: { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 } }
  );

  const buildingsQuery = trpc.buildingRouter.getBuildings.useQuery(
    { status: "active" },
    { placeholderData: { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 } }
  );

  const roomsQuery = trpc.roomRouter.getRooms.useQuery(
    { status: "active" },
    { placeholderData: { items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 } }
  );

  const categories = categoriesQuery.data?.items ?? [];
  const assetTypes = assetTypesQuery.data?.items ?? [];
  const conditions = conditionsQuery.data?.items ?? [];
  const departments = departmentsQuery.data?.items ?? [];
  const employees = employeesQuery.data?.items ?? [];
  const buildings = buildingsQuery.data?.items ?? [];
  const rooms = roomsQuery.data?.items ?? [];

  const custodianOptions = employees.map((e) => ({
    id: String(e.id),
    name: `${e.firstName} ${e.lastName}`,
  }));

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
    }
    onStepChange(Math.max(step - 1, 0));
  };

  const handleFormSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <section className="rounded-md border p-4">
      <h2 className="font-semibold">{STEP_TITLES[step]}</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        {STEP_DESCRIPTIONS[step]}
      </p>

      <form onSubmit={handleFormSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          {step === 0 && (
            <>
              <div className="md:col-span-2">
                <Field label="Asset name *">
                  <Controller
                    name="assetName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {fieldState.invalid && (
                          <p className="text-xs text-red-500">
                            {fieldState.error?.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </Field>
              </div>

              <Field label="Category *">
                <Controller
                  name="categoryId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
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
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>

              <Field label="Asset type *">
                <Controller
                  name="assetTypeId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
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
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>

              <Field label="Brand *">
                <Controller
                  name="brand"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>

              <Field label="Model *">
                <Controller
                  name="model"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Description">
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        className="min-h-16"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </Field>
              </div>

              <Field label="Condition *">
                <Controller
                  name="conditionId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
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
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>

              <Field label="Quantity *">
                <Controller
                  name="quantity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        type="number"
                        min={1}
                        value={field.value ?? 1}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : 1
                          )
                        }
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Serial number *">
                <Controller
                  name="serialNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>

              <Field label="QR Code">
                <Controller
                  name="qrCode"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Acquisition date *">
                <Controller
                  name="acquisitionDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
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
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>

              <Field label="Acquisition cost *">
                <Controller
                  name="acquisitionCost"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>

              <Field label="Supplier">
                <Controller
                  name="supplierId"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  )}
                />
              </Field>

              <Field label="Purchase order number">
                <Controller
                  name="purchaseOrderNumber"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </Field>

              <Field label="Warranty">
                <Controller
                  name="warranty"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </Field>

              <Field label="Supporting documents *">
                <Controller
                  name="supportingDocs"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {fieldState.invalid && (
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Department *">
                <Controller
                  name="departmentId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
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
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>

              <Field label="Assigned to *">
                <Controller
                  name="custodianId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
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
                        <p className="text-xs text-red-500">
                          {fieldState.error?.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </Field>

              <Field label="Building">
                <Controller
                  name="buildingId"
                  control={form.control}
                  render={({ field }) => (
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
                  )}
                />
              </Field>

              <Field label="Room">
                <Controller
                  name="roomId"
                  control={form.control}
                  render={({ field }) => (
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
                  )}
                />
              </Field>
            </>
          )}

          {step === 4 && (
            <div className="md:col-span-2">
              <p className="mb-3 text-sm font-semibold">Review & Confirm</p>
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
        </div>

        {step < 4 && (
          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 size-4" />
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            <Button type="button" onClick={validateAndNext}>
              Next <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 size-4" />
              {isSubmitting ? "Saving…" : "Save asset"}
            </Button>
          </div>
        )}
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      {label}
      {children}
    </label>
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
        ["Description", values.description || "—"],
        [
          "Acquisition date",
          values.acquisitionDate
            ? new Date(values.acquisitionDate).toLocaleDateString()
            : "—",
        ],
        [
          "Acquisition cost",
          values.acquisitionCost != null ? `PHP ${values.acquisitionCost}` : "—",
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
