"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { AssetAssignmentHeaderSection } from "./asset-assignment-header-section";
import { AssetAssignmentStepper } from "./asset-assignment-stepper";
import { SelectAssetStep } from "./select-asset-step";
import { AssignmentDetailsForm, type AssignmentDetails } from "./assignment-details-form";
import { TermsConditionsForm } from "./terms-conditions-form";
import { AssignmentReview } from "./assignment-review";
import { AssetPreviewCard } from "./asset-preview-card";
import { AssignmentSummaryCard } from "./assignment-summary-card";
import { AssignmentHistoryCard } from "./assignment-history-card";
import { AssignmentActions } from "./assignment-actions";
import type { AssignableAsset } from "./types";

const initialDetails: AssignmentDetails = { assigneeId: "", department: "", office: "", location: "", assignmentDate: new Date().toISOString().slice(0, 10), returnDate: "", purpose: "", remarks: "" };

export function AssetAssignmentContentSection() {
  const [step, setStep] = useState(0);
  const [asset, setAsset] = useState<AssignableAsset>();
  const [details, setDetails] = useState<AssignmentDetails>(initialDetails);
  const [terms, setTerms] = useState([false, false, false, false]);
  const [assigned, setAssigned] = useState(false);
  const [pending, startTransition] = useTransition();
  const valid = step === 0 ? Boolean(asset) : step === 1 ? Boolean(details.assigneeId && details.department && details.office && details.location && details.assignmentDate) : step === 2 ? terms.every(Boolean) : Boolean(asset && details.assigneeId && terms.every(Boolean));
  function advance() { if (!valid) { toast.error("Complete the required information before continuing."); return; } setStep((current) => Math.min(3, current + 1)); }
  function confirm() { startTransition(async () => { await new Promise((resolve) => window.setTimeout(resolve, 450)); setAssigned(true); toast.success("Demo assignment confirmed. No backend records were changed."); }); }
  function cancel() { setStep(0); setAsset(undefined); setDetails(initialDetails); setTerms([false, false, false, false]); setAssigned(false); }
  return <main className="mx-auto max-w-[1440px] space-y-5">
    <AssetAssignmentHeaderSection canReview={Boolean(asset && details.assigneeId && terms.every(Boolean))} onReview={() => { if (asset && details.assigneeId && terms.every(Boolean)) setStep(3); }} onCancel={cancel} />
    <AssetAssignmentStepper current={step} onSelect={setStep} />
    {assigned && <div className="rounded-md border border-success-border bg-success p-3 text-sm text-success-foreground">The demo assignment has been completed locally. The asset is now shown as assigned in this workflow only.</div>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]"><Card><CardContent className="p-5">{step === 0 && <SelectAssetStep selected={asset} onSelect={setAsset} />}{step === 1 && <AssignmentDetailsForm value={details} onChange={setDetails} />}{step === 2 && <TermsConditionsForm accepted={terms} onChange={setTerms} />}{step === 3 && asset && <AssignmentReview asset={asset} details={details} termsAccepted={terms.every(Boolean)} />}<AssignmentActions step={step} disabled={!valid} pending={pending} onBack={() => setStep((current) => Math.max(0, current - 1))} onNext={advance} onConfirm={confirm} /></CardContent></Card>
      <aside className="space-y-4"><AssetPreviewCard asset={asset} /><AssignmentSummaryCard asset={asset} details={details} /><AssignmentHistoryCard assigned={assigned} /><div className="rounded-md border border-info-border bg-info p-4 text-xs text-info-foreground"><strong>Help</strong><p className="mt-2 leading-5">Use the QR code or search to quickly find an available asset. Ensure the assignee acknowledges the asset responsibility terms.</p></div></aside>
    </div>
  </main>;
}
