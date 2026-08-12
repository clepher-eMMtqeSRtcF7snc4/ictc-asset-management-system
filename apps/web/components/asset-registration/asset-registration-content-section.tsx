"use client";

import type { Category, Department, Location, RegistrationIdentifiers, RegisterAssetInput, UserManagementUser } from "@repo/trpc/schemas";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AssetImageUpload } from "./asset-image-upload";
import { AssetRegistrationHeaderSection } from "./asset-registration-header-section";
import { AssetRegistrationStepper } from "./asset-registration-stepper";
import { AssetStickerPreview } from "./asset-sticker-preview";
import { AssetStickerPrintLayout } from "./asset-sticker-print-layout";
import { StickerPrintActions } from "./sticker-print-actions";

type FormValues = Record<string, string | undefined>;
const initialValues: FormValues = { condition: "new", assetType: "ICT Equipment", depreciationMethod: "straight-line" };
const steps = ["Asset details", "Identification", "Acquisition", "Assignment", "Review"];

export function AssetRegistrationContentSection({
  categories, departments, locations, custodians, loadError, onRegister, onPreviewIdentifiers,
}: {
  categories: Category[]; departments: Department[]; locations: Location[]; custodians: UserManagementUser[]; loadError?: string;
  onRegister: (input: RegisterAssetInput) => Promise<{ ok: boolean; id?: number; message?: string }>;
  onPreviewIdentifiers: (input: { categoryId: number }) => Promise<{ ok: true; data: RegistrationIdentifiers } | { ok: false; message: string }>;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [pending, startTransition] = useTransition();
  const [registered, setRegistered] = useState(false);
  const set = (key: string, value: string | undefined) => setValues((previous) => ({ ...previous, [key]: value }));
  const [generated, setGenerated] = useState<RegistrationIdentifiers>();
  useEffect(() => {
    if (!values.categoryId) { setGenerated(undefined); return; }
    void onPreviewIdentifiers({ categoryId: Number(values.categoryId) }).then((result) => {
      if (result.ok) setGenerated(result.data);
      else toast.error(result.message);
    });
  }, [onPreviewIdentifiers, values.categoryId]);
  const missing = step === 0 ? !values.name || !values.categoryId : step === 1 ? !values.brand || !values.model : step === 2 ? !values.acquisitionDate || !values.acquisitionCost : false;
  function next() { if (missing) { toast.error("Complete the required fields before continuing."); return; } setStep((current) => Math.min(current + 1, 4)); }
  function submit() {
    startTransition(async () => {
      const optional = (key: string) => values[key]?.trim() || null;
      const optionalNumber = (key: string) => values[key] ? Number(values[key]) : null;
      const result = await onRegister({
        name: values.name!, categoryId: Number(values.categoryId), assetType: values.assetType!, brand: values.brand!, model: values.model!,
        description: optional("description"), condition: values.condition!, serialNumber: optional("serialNumber"), barcode: optional("barcode"), partNumber: null,
        acquisitionDate: values.acquisitionDate!, purchaseDate: optional("purchaseDate"), acquisitionCost: Number(values.acquisitionCost),
        supplier: optional("supplier"), reference: optional("referenceNumber"), fundingSource: optional("fundingSource"),
        warrantyStartDate: optional("warrantyStartDate"), warrantyEndDate: optional("warrantyEndDate"), usefulLife: optionalNumber("usefulLife"),
        residualValue: optionalNumber("residualValue"), depreciationMethod: optional("depreciationMethod"), departmentId: optionalNumber("departmentId"),
        locationId: optionalNumber("locationId"), custodianId: optional("custodianId"), imageUrl: optional("imageUrl"), status: "available",
      });
      if (!result.ok || !result.id) { toast.error(result.message ?? "Asset registration failed."); return; }
      setRegistered(true);
      toast.success("Demo asset registration completed.");
    });
  }
  return <main className="mx-auto max-w-7xl space-y-6">
    <style jsx global>{`@media print { body * { visibility: hidden !important; } #asset-sticker, #asset-sticker * { visibility: visible !important; } #asset-sticker { position: fixed; left: 0; top: 0; width: 3.5in; min-height: 2in; box-shadow: none; } @page { size: 3.5in 2in; margin: 0; } }`}</style>
    <AssetRegistrationHeaderSection />
    {registered && <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">Demo asset <strong>{generated?.assetTag}</strong> has been registered. No data was sent to the backend.</div>}
    {loadError && <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{loadError}</p>}
    <Card><CardContent className="pt-6"><AssetRegistrationStepper current={step} /></CardContent></Card>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardHeader><CardTitle>{steps[step]}</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          {step === 0 && <BasicInformation values={values} set={set} categories={categories} />}
          {step === 1 && <Identification values={values} set={set} generated={generated} />}
          {step === 2 && <Acquisition values={values} set={set} />}
          {step === 3 && <Assignment values={values} set={set} departments={departments} locations={locations} custodians={custodians} />}
          {step === 4 && <Review values={values} generated={generated} />}
          <div className="flex justify-between border-t pt-5">
            <Button type="button" variant="outline" disabled={step === 0 || pending} onClick={() => setStep((current) => current - 1)}><ArrowLeft className="mr-2 size-4" />Back</Button>
            {step < 4 ? <Button type="button" onClick={next}>Continue<ArrowRight className="ml-2 size-4" /></Button> :
              <Button type="button" disabled={pending} onClick={submit}><Send className="mr-2 size-4" />{pending ? "Registering…" : "Register asset"}</Button>}
          </div>
        </CardContent>
      </Card>
      <aside className="space-y-4 print:hidden">
        <Card><CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Property sticker</CardTitle><StickerPrintActions /></CardHeader><CardContent><AssetStickerPreview assetTag={generated?.assetTag ?? "Generated on registration"} propertyNumber={generated?.propertyNumber ?? "Generated on registration"} name={values.name ?? ""} qrValue={generated?.qrValue ?? "https://example.invalid/assets/pending"} /></CardContent></Card>
        <p className="text-xs text-muted-foreground">Final identifiers and a secure QR URL are generated by the server when the record is registered.</p>
      </aside>
    </div>
    <AssetStickerPrintLayout><div className="hidden print:block"><AssetStickerPreview assetTag={generated?.assetTag ?? "Generated on registration"} propertyNumber={generated?.propertyNumber ?? "Generated on registration"} name={values.name ?? ""} qrValue={generated?.qrValue ?? "https://example.invalid/assets/pending"} /></div></AssetStickerPrintLayout>
  </main>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div>; }
function Text({ label, name, values, set, type = "text", required = false }: { label: string; name: string; values: FormValues; set: (key: string, value: string) => void; type?: string; required?: boolean }) { return <Field label={`${label}${required ? " *" : ""}`}><Input type={type} value={values[name] ?? ""} onChange={(event) => set(name, event.target.value)} /></Field>; }
function BasicInformation({ values, set, categories }: { values: FormValues; set: (key: string, value: string) => void; categories: Category[] }) {
  return <div className="grid gap-4 md:grid-cols-2"><Text label="Asset name" name="name" values={values} set={set} required /><Field label="Category *"><Select value={values.categoryId} onValueChange={(value) => set("categoryId", value)}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}</SelectContent></Select></Field><Text label="Asset type" name="assetType" values={values} set={set} /><Text label="Brand" name="brand" values={values} set={set} required /><Text label="Model" name="model" values={values} set={set} required /><div className="md:col-span-2"><Field label="Description"><Textarea value={values.description ?? ""} onChange={(event) => set("description", event.target.value)} /></Field></div><div className="md:col-span-2"><AssetImageUpload value={values.imageUrl} onChange={(value) => set("imageUrl", value ?? "")} /></div></div>;
}
function Identification({ values, set, generated }: { values: FormValues; set: (key: string, value: string) => void; generated?: { assetTag: string; propertyNumber: string } }) {
  return <div className="grid gap-4 md:grid-cols-2"><Text label="Serial number" name="serialNumber" values={values} set={set} /><Text label="Barcode / part number" name="barcode" values={values} set={set} /><Field label="Condition"><Select value={values.condition} onValueChange={(value) => set("condition", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["new", "good", "fair", "poor"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></Field><div className="rounded-md border bg-muted/40 p-3 text-sm"><p className="text-muted-foreground">System-generated asset tag</p><p className="font-mono font-semibold">{generated?.assetTag ?? "Select a category to preview"}</p><p className="mt-2 text-muted-foreground">System-generated property number</p><p className="font-mono font-semibold">{generated?.propertyNumber ?? "Select a category to preview"}</p></div></div>;
}
function Acquisition({ values, set }: { values: FormValues; set: (key: string, value: string) => void }) { return <div className="grid gap-4 md:grid-cols-2"><Text label="Acquisition date" name="acquisitionDate" values={values} set={set} type="date" /><Text label="Purchase date" name="purchaseDate" values={values} set={set} type="date" /><Text label="Acquisition cost" name="acquisitionCost" values={values} set={set} type="number" /><Text label="Supplier" name="supplier" values={values} set={set} /><Text label="Reference number" name="referenceNumber" values={values} set={set} /><Text label="Funding source" name="fundingSource" values={values} set={set} /><Text label="Warranty start" name="warrantyStartDate" values={values} set={set} type="date" /><Text label="Warranty end" name="warrantyEndDate" values={values} set={set} type="date" /><Text label="Useful life (years)" name="usefulLife" values={values} set={set} type="number" /><Text label="Residual value" name="residualValue" values={values} set={set} type="number" /></div>; }
function Assignment({ values, set, departments, locations, custodians }: { values: FormValues; set: (key: string, value: string) => void; departments: Department[]; locations: Location[]; custodians: UserManagementUser[] }) { const choice = (label: string, name: string, items: { id: string | number; name: string }[]) => <Field label={label}><Select value={values[name]} onValueChange={(value) => set(name, value)}><SelectTrigger><SelectValue placeholder={`Select ${label.toLowerCase()}`} /></SelectTrigger><SelectContent>{items.map((item) => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}</SelectContent></Select></Field>; return <div className="grid gap-4 md:grid-cols-2">{choice("Department", "departmentId", departments)}{choice("Location", "locationId", locations)}{choice("Custodian", "custodianId", custodians.map((item) => ({ id: item.id, name: `${item.firstName} ${item.lastName}` })))}</div>; }
function Review({ values, generated }: { values: FormValues; generated?: { assetTag: string; propertyNumber: string } }) { return <div className="space-y-3 rounded-lg border p-4 text-sm"><p className="font-medium">Ready to create the authoritative asset record</p><dl className="grid grid-cols-2 gap-3">{[["Asset", values.name], ["Brand / model", `${values.brand ?? ""} ${values.model ?? ""}`], ["Asset tag", generated?.assetTag ?? "Generated on registration"], ["Property number", generated?.propertyNumber ?? "Generated on registration"]].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl><p className="text-muted-foreground">Submitting creates the initial immutable asset history entry. This record cannot be permanently deleted.</p></div>; }
