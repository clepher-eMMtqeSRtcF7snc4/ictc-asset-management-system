"use client";

import { CheckCircle2, CircleHelp, Printer } from "lucide-react";
import { useEffect, useState, useTransition, useCallback } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { AssetStickerPreview } from "@/components/assets/registration/asset-sticker-preview";
import { AssetStickerPrintLayout } from "@/components/assets/registration/asset-sticker-print-layout";
import { AssetRegistrationStepper } from "@/components/assets/registration/asset-registration-stepper";
import { RegistrationStepPanel } from "@/components/assets/registration/asset-step-panel";
import { trpc } from "@/lib/trpc/client";
import type { AssetRegistrationInput } from "@repo/trpc/schemas";

type StickerData = {
  assetTag: string;
  propertyNumber: string;
  name: string;
  qrValue: string;
  modelNumber: string;
  serialNumber: string;
  acquisitionDateCost: string;
  referencePo: string;
  personAccountable: string;
};

const EMPTY_STICKER: StickerData = {
  assetTag: "—",
  propertyNumber: "—",
  name: "—",
  qrValue: "",
  modelNumber: "—",
  serialNumber: "—",
  acquisitionDateCost: "—",
  referencePo: "—",
  personAccountable: "—",
};

export default function AssetRegistrationPage() {
  const createAsset = trpc.registrationRouter.create.useMutation();
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [registered, setRegistered] = useState(false);
  const [employeeNameById, setEmployeeNameById] = useState<Record<number, string>>({});
  const activeEmployeesQuery = trpc.employeeRouter.getActiveEmployees.useQuery();
  const [stickerData, setStickerData] = useState<StickerData>(EMPTY_STICKER);

  useEffect(() => {
    const mapping = Object.fromEntries(
      (activeEmployeesQuery.data ?? []).map((employee) => [employee.id, employee.name]),
    ) as Record<number, string>;
    setEmployeeNameById(mapping);
  }, [activeEmployeesQuery.data]);

  const buildStickerData = useCallback(
    (data: AssetRegistrationInput, overrides: Partial<StickerData> = {}): StickerData => {
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

      return {
        assetTag: overrides.propertyNumber ?? "—",
        propertyNumber: overrides.propertyNumber ?? "—",
        name: data.assetName || "—",
        qrValue: overrides.qrValue ?? "",
        modelNumber: data.model || "—",
        serialNumber: data.serialNumber || "—",
        acquisitionDateCost,
        referencePo: data.purchaseOrderNumber || "—",
        personAccountable,
        ...overrides,
      };
    },
    [employeeNameById],
  );

  const updateStickerFromForm = useCallback(
    (data: AssetRegistrationInput) => {
      setStickerData((prev) =>
        registered ? prev : buildStickerData(data),
      );
    },
    [registered, buildStickerData],
  );

  function submit(data: AssetRegistrationInput) {
    startTransition(async () => {
      const result = await registerAsset(data);
      console.log("Registration result:", result);

      if (!result.ok) {
        flushSync(() => {
          toast.error(result.message ?? "Asset registration failed.");
        });
        return;
      }

      const propertyNumber =
        result.propertyNumber ?? `MSU-ICT-${String(result.id ?? 0).padStart(6, "0")}`;
      const qrValue = result.qrCode ?? `ASSET|${propertyNumber}`;

      setStickerData(buildStickerData(data, { propertyNumber, qrValue }));
      setRegistered(true);
      toast.success("Asset registration completed.");
    });
  }

  async function registerAsset(data: AssetRegistrationInput) {
    try {
      const result = await createAsset.mutateAsync(data);
      return {
        ok: true,
        id: result.id,
        propertyNumber: result.propertyNumber,
        qrCode: result.qrCode,
        assetName: result.assetName,
        message: "Asset registered successfully.",
      };
    } catch (error: unknown) {
      console.log("Registration error:", error);
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? String((error as { message: unknown }).message)
            : "Asset registration failed.";
      return {
        ok: false,
        message,
      };
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Registration"
        description="Register a new ICT asset and generate a QR sticker for physical inventory."
      />
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
                  onFormValuesChange={updateStickerFromForm}
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
    </div>
  );
}
