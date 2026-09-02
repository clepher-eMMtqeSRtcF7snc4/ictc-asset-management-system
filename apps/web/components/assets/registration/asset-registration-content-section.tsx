"use client";

import { CheckCircle2, CircleHelp, Printer } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AssetStickerPreview } from "./asset-sticker-preview";
import { AssetStickerPrintLayout } from "./asset-sticker-print-layout";
import { AssetRegistrationStepper } from "./asset-registration-stepper";
import { RegistrationStepPanel } from "./asset-step-panel";
import { trpc } from "@/lib/trpc/client";
import type { AssetRegistrationInput } from "@repo/trpc/schemas";

export function AssetRegistrationContentSection({
  onRegister,
}: {
  onRegister: (
    data: AssetRegistrationInput,
  ) => Promise<{
    ok: boolean;
    id?: number;
    message?: string;
    propertyNumber?: string;
    qrCode?: string;
    assetName?: string;
  }>;
}) {
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [registered, setRegistered] = useState(false);
  const [employeeNameById, setEmployeeNameById] = useState<Record<number, string>>({});
  const activeEmployeesQuery = trpc.employeeRouter.getActiveEmployees.useQuery();
  const [stickerData, setStickerData] = useState<{
    assetTag: string;
    propertyNumber: string;
    name: string;
    qrValue: string;
    modelNumber: string;
    serialNumber: string;
    acquisitionDateCost: string;
    referencePo: string;
    personAccountable: string;
  }>({
    assetTag: "MSU-ICT-000000",
    propertyNumber: "MSU-ICT-000000",
    name: "Asset name",
    qrValue: "ASSET|MSU-ICT-000000",
    modelNumber: "—",
    serialNumber: "—",
    acquisitionDateCost: "—",
    referencePo: "—",
    personAccountable: "—",
  });

  useEffect(() => {
    const mapping = Object.fromEntries(
      (activeEmployeesQuery.data ?? []).map((employee) => [employee.id, employee.name]),
    ) as Record<number, string>;
    setEmployeeNameById(mapping);
  }, [activeEmployeesQuery.data]);

  function submit(data: AssetRegistrationInput) {
    startTransition(async () => {
      const result = await onRegister(data);
      if (!result.ok) {
        toast.error(result.message ?? "Asset registration failed.");
        return;
      }

      const assetName = result.assetName ?? data.assetName ?? "Asset name";
      const propertyNumber =
        result.propertyNumber ?? `MSU-ICT-${String(result.id ?? 0).padStart(6, "0")}`;
      const assetTag = propertyNumber;
      const qrValue = result.qrCode ?? `ASSET|${propertyNumber}`;
      const personAccountable =
        data.custodianId != null
          ? employeeNameById[data.custodianId] ?? "Custodian"
          : "—";
      const acquisitionDate = data.acquisitionDate
        ? new Date(data.acquisitionDate).toLocaleDateString()
        : "—";
      const acquisitionCost =
        data.acquisitionCost != null ? `PHP ${data.acquisitionCost}` : "—";
      const acquisitionDateCost =
        acquisitionDate === "—" && acquisitionCost === "—"
          ? "—"
          : `${acquisitionDate} / ${acquisitionCost}`;

      setStickerData({
        assetTag,
        propertyNumber,
        name: assetName,
        qrValue,
        modelNumber: data.model || "—",
        serialNumber: data.serialNumber || "—",
        acquisitionDateCost,
        referencePo: data.purchaseOrderNumber || "—",
        personAccountable,
      });
      setRegistered(true);
      toast.success("Asset registration completed.");
    });
  }

  return (
    <main className="mx-auto max-w-[1440px] space-y-5 p-1">
      <AssetRegistrationStepper current={step} onSelect={setStep} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4">
          {registered && (
            <div className="rounded-lg border border-success-border bg-success p-4 text-sm text-success-foreground">
              <CheckCircle2 className="mr-2 inline size-4" />
              The asset has been registered.
            </div>
          )}

          <section className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="mt-3">
              <RegistrationStepPanel
                step={step}
                onStepChange={setStep}
                onSubmit={submit}
                isSubmitting={pending}
              />
            </div>
          </section>
        </section>

        <aside className="space-y-4 print:hidden">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                  <span>Sticker preview</span>
                  <CircleHelp className="size-3 text-muted-foreground" />
                </p>
                {registered && (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <Printer className="mr-1.5 size-3.5" />
                    Print / Save as PDF
                  </Button>
                )}
              </div>
              <AssetStickerPreview
                assetTag={stickerData.assetTag}
                propertyNumber={stickerData.propertyNumber}
                name={stickerData.name}
                qrValue={stickerData.qrValue}
                modelNumber={stickerData.modelNumber}
                serialNumber={stickerData.serialNumber}
                acquisitionDateCost={stickerData.acquisitionDateCost}
                referencePo={stickerData.referencePo}
                personAccountable={stickerData.personAccountable}
              />
            </CardContent>
          </Card>
        </aside>
      </div>

      <AssetStickerPrintLayout>
        <div className="hidden print:block">
          <AssetStickerPreview
            assetTag={stickerData.assetTag}
            propertyNumber={stickerData.propertyNumber}
            name={stickerData.name}
            qrValue={stickerData.qrValue}
            modelNumber={stickerData.modelNumber}
            serialNumber={stickerData.serialNumber}
            acquisitionDateCost={stickerData.acquisitionDateCost}
            referencePo={stickerData.referencePo}
            personAccountable={stickerData.personAccountable}
          />
        </div>
      </AssetStickerPrintLayout>
    </main>
  );
}
