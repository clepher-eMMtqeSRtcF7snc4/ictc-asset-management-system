"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { ArchiveRestore, Check, ClipboardCheck, History, Monitor } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AssetDisposalHeaderSection } from "./asset-disposal-header-section"
import { AssetDisposalStepper } from "./asset-disposal-stepper"
import { DisposalDetailsForm } from "./disposal-details-form"
import { DisposalDocumentsForm } from "./disposal-documents-form"
import { SelectDisposalAssetStep } from "./select-disposal-asset-step"
import type { DisposalAsset, DisposalDetails, DisposalDocuments } from "./types"

const initialDetails: DisposalDetails = {
  reason: "",
  otherReason: "",
  method: "",
  otherMethod: "",
  requestDate: new Date().toISOString().slice(0, 10),
  remarks: "",
  accountabilityCleared: false,
}
const initialDocuments: DisposalDocuments = {
  inspectionReport: false,
  committeeResolution: false,
  approvalDocument: false,
  supportingDocuments: false,
  approvalAcknowledged: false,
}

export function AssetDisposalContentSection() {
  const [step, setStep] = useState(0)
  const [asset, setAsset] = useState<DisposalAsset>()
  const [details, setDetails] = useState<DisposalDetails>(initialDetails)
  const [documents, setDocuments] = useState<DisposalDocuments>(initialDocuments)
  const [completed, setCompleted] = useState(false)
  const [pending, startTransition] = useTransition()
  const detailValid = Boolean(
    details.reason &&
      details.method &&
      details.requestDate &&
      details.remarks &&
      details.accountabilityCleared &&
      (details.reason !== "OTHER" || details.otherReason) &&
      (details.method !== "OTHER" || details.otherMethod),
  )
  const documentValid = Boolean(documents.inspectionReport && documents.committeeResolution && documents.approvalDocument && documents.approvalAcknowledged)
  const valid = step === 0 ? Boolean(asset) : step === 1 ? detailValid : step === 2 ? documentValid : completed

  function reset() {
    setStep(0)
    setAsset(undefined)
    setDetails(initialDetails)
    setDocuments(initialDocuments)
    setCompleted(false)
  }
  function next() {
    if (!valid) {
      toast.error("Complete the required disposal information before continuing.")
      return
    }
    setStep((current) => Math.min(3, current + 1))
  }
  function complete() {
    startTransition(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 450))
      setCompleted(true)
      setStep(4)
      toast.success("Demo disposal request submitted. No backend records were changed.")
    })
  }

  return (
    <main className="mx-auto max-w-[1440px] space-y-5">
      <AssetDisposalHeaderSection enabled={Boolean(asset && detailValid && documentValid)} onReview={() => asset && detailValid && documentValid && setStep(3)} onCancel={reset} />
      <AssetDisposalStepper current={Math.min(step, 3)} onSelect={setStep} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Card>
          <CardContent className="p-5">
            {step === 0 && <SelectDisposalAssetStep selected={asset} onSelect={setAsset} />}
            {step === 1 && asset && <DisposalDetailsForm asset={asset} value={details} onChange={setDetails} />}
            {step === 2 && <DisposalDocumentsForm value={documents} onChange={setDocuments} />}
            {step === 3 && asset && <Review asset={asset} details={details} documents={documents} />}
            {step === 4 && asset && <Completed asset={asset} details={details} />}
            <div className="mt-5 flex justify-between border-t pt-4">
              <Button variant="outline" disabled={step === 0 || pending || step === 4} onClick={() => setStep((current) => current - 1)}>Back</Button>
              {step < 3 && <Button disabled={!valid} onClick={next}>Continue</Button>}
              {step === 3 && <Button disabled={!valid || pending} onClick={complete}>{pending ? "Submitting…" : "Submit Disposal Request"}</Button>}
              {step === 4 && <Button onClick={reset}>Create another request</Button>}
            </div>
          </CardContent>
        </Card>
        <aside className="space-y-4">
          <AssetSummary asset={asset} />
          <HistoryCard completed={completed} />
          <ReminderCards />
        </aside>
      </div>
    </main>
  )
}

function AssetSummary({ asset }: { asset?: DisposalAsset }) {
  return <Card><CardContent className="p-4"><p className="mb-3 text-xs font-semibold">Asset Summary</p>{asset ? <div className="space-y-3"><div className="flex gap-3"><span className="grid size-14 place-items-center rounded bg-muted"><Monitor className="size-7 text-muted-foreground" /></span><div><p className="font-semibold">{asset.name}</p><p className="font-mono text-xs text-primary">{asset.assetTag}</p><Badge className="mt-1" variant="warning">{asset.status}</Badge></div></div><Rows rows={[["Property No.", asset.propertyNumber], ["Serial Number", asset.serialNumber], ["Category", asset.category], ["Brand / Model", asset.brandModel], ["Condition", asset.condition], ["Acquired Date", asset.acquiredDate], ["Acquisition Cost", asset.acquisitionCost], ["Depreciated Value", asset.bookValue], ["Current Location", asset.location], ["Accountable", asset.custodian]]} /></div> : <p className="text-sm text-muted-foreground">Select an eligible asset to see its financial and accountability summary.</p>}</CardContent></Card>
}

function HistoryCard({ completed }: { completed: boolean }) {
  return <Card><CardContent className="p-4"><p className="mb-3 flex items-center gap-2 text-xs font-semibold"><History className="size-4 text-primary" />Disposal History</p>{completed ? <p className="text-xs"><strong className="text-success-foreground">Disposal request submitted</strong><br /><span className="text-muted-foreground">Just now · Awaiting controlled review</span></p> : <div className="py-4 text-center text-xs text-muted-foreground"><ArchiveRestore className="mx-auto mb-2 size-7 opacity-50" />No disposal history<br />This asset has not been disposed yet.</div>}</CardContent></Card>
}

function ReminderCards() {
  return <><div className="rounded-md border border-success-border bg-success p-4 text-xs text-success-foreground"><p className="font-semibold">Important Reminders</p><ul className="mt-2 space-y-1.5">{["Ensure the asset is no longer serviceable or usable.", "Attach all required documents before requesting approval.", "Disposal is final and cannot be undone normally.", "Disposed assets remain available for audit history."].map((item) => <li key={item} className="flex gap-2"><Check className="size-3.5 shrink-0" />{item}</li>)}</ul></div><div className="rounded-md border border-warning-border bg-warning p-4 text-xs text-warning-foreground"><p className="font-semibold">Next Steps After Submission</p><ul className="mt-2 space-y-1.5">{["Eligibility and committee review", "Authorized disposal approval", "Physical disposal execution", "Final certificate and status update"].map((item) => <li key={item} className="flex gap-2"><Check className="size-3.5 shrink-0" />{item}</li>)}</ul></div></>
}

function Review({ asset, details, documents }: { asset: DisposalAsset; details: DisposalDetails; documents: DisposalDocuments }) {
  return <section><h2 className="text-base font-semibold">4. Review & Confirm</h2><p className="mb-4 text-xs text-muted-foreground">Verify the disposal request before submitting it for controlled review.</p><div className="grid gap-4 md:grid-cols-2"><div className="rounded-md border p-4"><p className="mb-3 font-semibold">Asset & Financial Information</p><Rows rows={[["Asset", asset.name], ["Asset Tag", asset.assetTag], ["Custodian", asset.custodian], ["Condition", asset.condition], ["Book Value", asset.bookValue]]} /></div><div className="rounded-md border p-4"><p className="mb-3 font-semibold">Disposal Request</p><Rows rows={[["Reason", details.reason.replaceAll("_", " ")], ["Method", details.method.replaceAll("_", " ")], ["Request Date", details.requestDate], ["Accountability", details.accountabilityCleared ? "Cleared" : "Pending"], ["Required Documents", documents.inspectionReport && documents.committeeResolution && documents.approvalDocument ? "Attached" : "Incomplete"]]} /></div></div><div className="mt-4 rounded-md border border-warning-border bg-warning p-3 text-xs text-warning-foreground">Submitting this static request starts a local approval workflow only. No asset status or backend record will be changed.</div></section>
}

function Completed({ asset, details }: { asset: DisposalAsset; details: DisposalDetails }) {
  return <section className="py-8 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-success text-success-foreground"><ClipboardCheck className="size-7" /></span><h2 className="mt-4 text-xl font-bold">Disposal Request Submitted</h2><p className="mt-2 text-sm text-muted-foreground">{asset.name} has been submitted for controlled approval and disposal review.</p><div className="mx-auto mt-5 max-w-md rounded-md border bg-muted/30 p-4 text-left"><Rows rows={[["Request ID", "DSP-DEMO-0001"], ["Asset Status", "For Disposal"], ["Disposal Reason", details.reason.replaceAll("_", " ")], ["Review Status", "Requested"], ["Record", "Created locally (demo)"]]} /></div></section>
}

function Rows({ rows }: { rows: string[][] }) {
  return <dl className="space-y-2 text-xs">{rows.map(([label, value]) => <div key={label} className="flex justify-between gap-3"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl>
}
