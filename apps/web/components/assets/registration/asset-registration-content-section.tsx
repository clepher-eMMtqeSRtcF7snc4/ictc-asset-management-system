"use client";

import type {
  StaticCategory,
  StaticCustodian,
  StaticDepartment,
  StaticLocation,
  StaticRegistrationIdentifiers,
} from "./types";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Eye,
  Printer,
  QrCode,
  Save,
  ScanLine,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AssetImageUpload } from "./asset-image-upload";
import { AssetStickerPreview } from "./asset-sticker-preview";
import { AssetStickerPrintLayout } from "./asset-sticker-print-layout";

type FormValues = Record<string, string | undefined>;
const initialValues: FormValues = {
  name: "SAMSUNG MONITOR 24″",
  categoryId: "1",
  assetType: "ICT Equipment",
  brand: "Samsung",
  model: "S24C310",
  description: "24-inch LED Monitor",
  condition: "new",
  acquisitionDate: "2026-08-12",
  acquisitionCost: "12500",
  quantity: "1",
  depreciationMethod: "straight-line",
};
const labels = [
  "Basic Information",
  "Identification",
  "Acquisition",
  "Location & Assignment",
  "Review & Confirm",
];
const helperText = [
  "Asset details",
  "Serial & tags",
  "Purchase details",
  "Where & to whom",
  "Preview & save",
];

export function AssetRegistrationContentSection({
  categories,
  departments,
  locations,
  custodians,
  onRegister,
  onPreviewIdentifiers,
}: {
  categories: StaticCategory[];
  departments: StaticDepartment[];
  locations: StaticLocation[];
  custodians: StaticCustodian[];
  onRegister: () => Promise<{ ok: boolean; id?: number; message?: string }>;
  onPreviewIdentifiers: (input: {
    categoryId: number;
  }) => Promise<
    { ok: true; data: StaticRegistrationIdentifiers } | { ok: false; message: string }
  >;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [pending, startTransition] = useTransition();
  const [registered, setRegistered] = useState(false);
  const [generated, setGenerated] = useState<StaticRegistrationIdentifiers>();
  const set = (key: string, value: string | undefined) =>
    setValues((previous) => ({ ...previous, [key]: value }));
  useEffect(() => {
    if (!values.categoryId) return;
    void onPreviewIdentifiers({ categoryId: Number(values.categoryId) }).then(
      (result) =>
        result.ok ? setGenerated(result.data) : toast.error(result.message),
    );
  }, [onPreviewIdentifiers, values.categoryId]);

  const identifiers = generated ?? {
    assetTag: "MSU-ICT-2024-000123",
    propertyNumber: "PROP-2024-000123",
    qrValue: "ASSET|MSU-ICT-2024-000123",
  };

  const missing =
    step === 0
      ? !values.name || !values.categoryId || !values.brand || !values.model
      : step === 2
        ? !values.acquisitionDate || !values.acquisitionCost
        : false;

  const next = () => {
    if (missing) {
      toast.error("Complete the required fields before continuing.");
      return;
    }
    setStep((current) => Math.min(current + 1, 4));
  };

  function submit() {
    startTransition(async () => {
      const result = await onRegister();
      if (!result.ok) {
        toast.error(result.message ?? "Asset registration failed.");
        return;
      }
      setRegistered(true);
      toast.success("Demo asset registration completed.");
    });
  }

  return (
    <main className="mx-auto max-w-[1440px] space-y-5 p-1">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4">
          <section className="rounded-lg border bg-card p-5 shadow-sm">

            <ol className="mt-6 grid gap-3 border-b pb-5 sm:grid-cols-5">
              {labels.map((label, index) => (
                <li key={label} className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => index <= step && setStep(index)}
                    className={`grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold ${index === step ? "border-primary bg-primary text-primary-foreground shadow-sm" : index < step ? "border-primary bg-primary/15 text-primary" : "border-muted-foreground/40 text-muted-foreground"}`}
                  >
                    {index < step ? <Check className="size-4" /> : index + 1}
                  </button>
                  <span>
                    <span className="block text-xs font-semibold leading-4">
                      {label}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {helperText[index]}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-3">
              <StepPanel
                step={step}
                values={values}
                set={set}
                categories={categories}
                departments={departments}
                locations={locations}
                custodians={custodians}
                identifiers={identifiers}
              />

                {/* Next Button*/}
              <div className="mt-5 flex items-center justify-between border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    step === 0 ? setValues(initialValues) : setStep(step - 1)
                  }
                >
                  <ArrowLeft className="mr-2 size-4" />
                  {step === 0 ? "Cancel" : "Back"}
                </Button>

                {step < 4 ? (
                  <Button type="button" onClick={next}>
                    Next <ArrowRight className="ml-2 size-4" />
                  </Button>
                ) : (
                  <Button type="button" disabled={pending} onClick={submit}>
                    <Save className="mr-2 size-4" />
                    {pending ? "Saving…" : "Save asset"}
                  </Button>
                )}
              </div>

            </div>
          </section>

          {registered && (
            <div className="rounded-lg border border-success-border bg-success p-4 text-sm text-success-foreground">
              <CheckCircle2 className="mr-2 inline size-4" />
              Demo asset <strong>{identifiers.assetTag}</strong> has been
              registered locally.
            </div>
          )}
          <AfterSaving />
        </section>

        <aside className="space-y-4 print:hidden">
          {/* Asset Image */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <PanelTitle title="Asset image" />
              <AssetImageUpload
                value={values.imageUrl}
                onChange={(value) => set("imageUrl", value)}
              />
            </CardContent>
          </Card>

          {/* Sticker */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <PanelTitle title="Sticker preview" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                >
                  <Printer className="mr-1.5 size-3.5" />
                  Print / Save as PDF
                </Button>
              </div>
              <AssetStickerPreview
                assetTag={identifiers.assetTag}
                propertyNumber={identifiers.propertyNumber}
                name={values.name ?? "Asset name"}
                qrValue={identifiers.qrValue}
              />
            </CardContent>
          </Card>

          <ScanBehavior />
        </aside>
      </div>

      <AssetStickerPrintLayout>
        <div className="hidden print:block">
          <AssetStickerPreview
            assetTag={identifiers.assetTag}
            propertyNumber={identifiers.propertyNumber}
            name={values.name ?? "Asset name"}
            qrValue={identifiers.qrValue}
          />
        </div>
      </AssetStickerPrintLayout>
    </main>
  );
}

function PanelTitle({ title }: { title: string }) {
  return (
    <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
      <span>{title}</span>
      <CircleHelp className="size-3 text-muted-foreground" />
    </p>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      {label}
      {children}
    </label>
  );
}
function Text({
  label,
  name,
  values,
  set,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  values: FormValues;
  set: (name: string, value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <Field label={`${label}${required ? " *" : ""}`}>
      <Input
        type={type}
        value={values[name] ?? ""}
        onChange={(event) => set(name, event.target.value)}
      />
    </Field>
  );
}
function StepPanel({
  step,
  values,
  set,
  categories,
  departments,
  locations,
  custodians,
  identifiers,
}: {
  step: number;
  values: FormValues;
  set: (name: string, value: string) => void;
  categories: StaticCategory[];
  departments: StaticDepartment[];
  locations: StaticLocation[];
  custodians: StaticCustodian[];
  identifiers: StaticRegistrationIdentifiers;
}) {
  if (step === 0)
    return (
      <section className="rounded-md border p-4">
        <h2 className="font-semibold">Basic Information</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Provide the basic details of the asset.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <Text
              label="Asset name"
              name="name"
              values={values}
              set={set}
              required
            />
          </div>
          <Field label="Category *">
            <Select
              value={values.categoryId}
              onValueChange={(value) => set("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Text
            label="Asset type"
            name="assetType"
            values={values}
            set={set}
            required
          />
          <Text label="Brand" name="brand" values={values} set={set} required />
          <Text label="Model" name="model" values={values} set={set} required />
          <div className="md:col-span-2">
            <Field label="Description">
              <Textarea
                className="min-h-16"
                value={values.description ?? ""}
                onChange={(event) => set("description", event.target.value)}
              />
            </Field>
          </div>
          <Field label="Condition *">
            <Select
              value={values.condition}
              onValueChange={(value) => set("condition", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["new", "good", "fair", "poor"].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Text
            label="Quantity"
            name="quantity"
            values={values}
            set={set}
            type="number"
            required
          />
          <GeneratedFields identifiers={identifiers} />
        </div>
      </section>
    );
  if (step === 1)
    return (
      <section className="rounded-md border p-4">
        <h2 className="font-semibold">Identification</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Serial number, barcode, and asset identifiers.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <Text
            label="Serial number"
            name="serialNumber"
            values={values}
            set={set}
          />
          <Text
            label="Barcode / part number"
            name="barcode"
            values={values}
            set={set}
          />
          <GeneratedFields identifiers={identifiers} />
        </div>
      </section>
    );
  if (step === 2)
    return (
      <section className="rounded-md border p-4">
        <h2 className="font-semibold">Acquisition</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Purchase and financial information.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <Text
            label="Acquisition date"
            name="acquisitionDate"
            values={values}
            set={set}
            type="date"
            required
          />
          <Text
            label="Acquisition cost (PHP)"
            name="acquisitionCost"
            values={values}
            set={set}
            type="number"
            required
          />
          <Text label="Supplier" name="supplier" values={values} set={set} />
          <Text
            label="Reference number"
            name="referenceNumber"
            values={values}
            set={set}
          />
        </div>
      </section>
    );
  if (step === 3)
    return (
      <section className="rounded-md border p-4">
        <h2 className="font-semibold">Location & Assignment</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Where the asset is located and who is responsible for it.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {selectField("Department", "departmentId", departments, values, set)}
          {selectField("Location", "locationId", locations, values, set)}
          {selectField(
            "Assigned to",
            "custodianId",
            custodians.map((u) => ({
              id: u.id,
              name: `${u.firstName} ${u.lastName}`,
            })),
            values,
            set,
          )}
        </div>
      </section>
    );
  return (
    <section className="rounded-md border p-4">
      <h2 className="font-semibold">Review & Confirm</h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Review the record before saving.
      </p>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {[
          ["Asset name", values.name],
          ["Brand / model", `${values.brand} / ${values.model}`],
          ["Asset tag", identifiers.assetTag],
          ["Property number", identifiers.propertyNumber],
          [
            "Cost",
            values.acquisitionCost ? `PHP ${values.acquisitionCost}` : "—",
          ],
          [
            "Location",
            locations.find((item) => String(item.id) === values.locationId)
              ?.name ?? "Not assigned",
          ],
        ].map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs text-muted-foreground">{key}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
function selectField(
  label: string,
  name: string,
  items: { id: string | number; name: string }[],
  values: FormValues,
  set: (name: string, value: string) => void,
) {
  return (
    <Field label={label}>
      <Select value={values[name]} onValueChange={(value) => set(name, value)}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
function GeneratedFields({
  identifiers,
}: {
  identifiers: StaticRegistrationIdentifiers;
}) {
  return (
    <div className="rounded-md border border-info-border bg-info p-3 text-info-foreground md:col-span-2">
      <p className="mb-3 text-xs font-semibold">
        System Generated{" "}
        <span className="font-normal">(will be auto-generated)</span>
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ["Asset Tag", identifiers.assetTag],
          ["Property Number", identifiers.propertyNumber],
          ["QR Code Value", identifiers.qrValue],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="mb-1 text-[11px]">{label}</p>
            <p className="truncate rounded border border-info-border bg-background/60 px-2 py-1.5 font-mono text-xs text-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
function ScanBehavior() {
  return (
    <Card className="border-warning-border bg-warning shadow-sm">
      <CardContent className="p-4 text-warning-foreground">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <ScanLine className="size-4" />
          QR Code Behavior
        </p>
        <p className="text-xs leading-5">
          When scanned, the system opens the asset detail page with current
          assignment, location, maintenance, warranty, and audit history.
        </p>
        <div className="mt-4 border-t border-warning-border pt-3">
          <p className="text-xs font-semibold">Printable Size</p>
          <p className="mt-1 text-xs">
            Recommended sticker size: 3.5 in × 2 in
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
function AfterSaving() {
  const steps: { icon: LucideIcon; text: string }[] = [
    { icon: Save, text: "Asset is saved" },
    { icon: QrCode, text: "Sticker is generated" },
    { icon: Printer, text: "Print and attach" },
    { icon: ScanLine, text: "Scan during inventory" },
    { icon: Eye, text: "View details & history" },
  ];
  return (
    <section className="rounded-lg border border-purple-border bg-purple p-4 text-purple-foreground">
      <p className="mb-3 text-sm font-semibold">After Saving</p>
      <div className="grid gap-3 text-center text-xs sm:grid-cols-5">
        {steps.map(({ icon: Icon, text }, index) => (
          <div
            key={text}
            className="flex items-center justify-center gap-2 sm:flex-col"
          >
            <span className="grid size-9 place-items-center rounded-lg border border-purple-border bg-background/50">
              <Icon className="size-4" />
            </span>
            <span>
              {index + 1}. {text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
