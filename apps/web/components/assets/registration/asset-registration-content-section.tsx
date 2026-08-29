"use client";

import { CheckCircle2, CircleHelp, Printer } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AssetStickerPreview } from "./asset-sticker-preview";
import { AssetStickerPrintLayout } from "./asset-sticker-print-layout";
import { AssetRegistrationStepper } from "./asset-registration-stepper";
import { RegistrationStepPanel } from "./asset-step-panel";
import type { AssetRegistrationInput } from "@repo/trpc/schemas";

export function AssetRegistrationContentSection({
  onRegister,
}: {
  onRegister: (
    data: AssetRegistrationInput
  ) => Promise<{ ok: boolean; id?: number; message?: string }>;
}) {
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [registered, setRegistered] = useState(false);

  function submit(data: AssetRegistrationInput) {
    startTransition(async () => {
      const result = await onRegister(data);
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
                assetTag="MSU-ICT-2024-000123"
                propertyNumber="PROP-2024-000123"
                name="Asset name"
                qrValue="ASSET|MSU-ICT-2024-000123"
              />
            </CardContent>
          </Card>
        </aside>
      </div>

      <AssetStickerPrintLayout>
        <div className="hidden print:block">
          <AssetStickerPreview
            assetTag="MSU-ICT-2024-000123"
            propertyNumber="PROP-2024-000123"
            name="Asset name"
            qrValue="ASSET|MSU-ICT-2024-000123"
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
