"use client";

import {
  registrationInitialValues,
  type RegistrationFormValues,
  type StaticCategory,
  type StaticCustodian,
  type StaticDepartment,
  type StaticLocation,
  type StaticRegistrationIdentifiers,
} from "@repo/trpc/schemas";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Printer,
  Save,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AssetImageUpload } from "./asset-image-upload";
import { AssetStickerPreview } from "./asset-sticker-preview";
import { AssetStickerPrintLayout } from "./asset-sticker-print-layout";
import { AssetRegistrationStepper } from "./asset-registration-stepper";
import { RegistrationStepPanel } from "./asset-step-panel";

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
    | { ok: true; data: StaticRegistrationIdentifiers }
    | { ok: false; message: string }
  >;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<RegistrationFormValues>(registrationInitialValues);
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
      <AssetRegistrationStepper
        current={step}
        onSelect={setStep}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4">
          <section className="rounded-lg border bg-card p-5 shadow-sm">

            <div className="mt-3">
              <RegistrationStepPanel
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
                    step === 0 ? setValues(registrationInitialValues) : setStep(step - 1)
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
          {/* <AfterSaving /> */}
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

          <GeneratedFields identifiers={identifiers} />

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

          {/* <ScanBehavior /> */}
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
      <div className="grid gap-2 grid-flow-col sm:grid-rows-3">
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

// function ScanBehavior() {
//   return (
//     <Card className="border-warning-border bg-warning shadow-sm">
//       <CardContent className="p-4 text-warning-foreground">
//         <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
//           <ScanLine className="size-4" />
//           QR Code Behavior
//         </p>
//         <p className="text-xs leading-5">
//           When scanned, the system opens the asset detail page with current
//           assignment, location, maintenance, warranty, and audit history.
//         </p>
//         <div className="mt-4 border-t border-warning-border pt-3">
//           <p className="text-xs font-semibold">Printable Size</p>
//           <p className="mt-1 text-xs">
//             Recommended sticker size: 3.5 in × 2 in
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
// function AfterSaving() {
//   const steps: { icon: LucideIcon; text: string }[] = [
//     { icon: Save, text: "Asset is saved" },
//     { icon: QrCode, text: "Sticker is generated" },
//     { icon: Printer, text: "Print and attach" },
//     { icon: ScanLine, text: "Scan during inventory" },
//     { icon: Eye, text: "View details & history" },
//   ];
//   return (
//     <section className="rounded-lg border border-purple-border bg-purple p-4 text-purple-foreground">
//       <p className="mb-3 text-sm font-semibold">After Saving</p>
//       <div className="grid gap-3 text-center text-xs sm:grid-cols-5">
//         {steps.map(({ icon: Icon, text }, index) => (
//           <div
//             key={text}
//             className="flex items-center justify-center gap-2 sm:flex-col"
//           >
//             <span className="grid size-9 place-items-center rounded-lg border border-purple-border bg-background/50">
//               <Icon className="size-4" />
//             </span>
//             <span>
//               {index + 1}. {text}
//             </span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
