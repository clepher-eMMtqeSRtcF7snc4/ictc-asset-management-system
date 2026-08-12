"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { DisposalAsset, DisposalDetails } from "./types"

const reasons = ["OBSOLETE", "BEYOND_REPAIR", "UNEconomical_TO_REPAIR", "DAMAGED", "END_OF_USEFUL_LIFE", "LOST", "DESTROYED", "REPLACED", "SURPLUS", "OTHER"]
const methods = ["SALE", "AUCTION", "TRANSFER", "DONATION", "RECYCLE", "SCRAP", "CONDEMNATION", "DESTRUCTION", "RETURN_TO_SUPPLIER", "OTHER"]

export function DisposalDetailsForm({
  asset,
  value,
  onChange,
}: {
  asset: DisposalAsset
  value: DisposalDetails
  onChange: (value: DisposalDetails) => void
}) {
  const update = (key: keyof DisposalDetails, next: string | boolean) => onChange({ ...value, [key]: next })
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">2. Disposal Details</h2>
        <p className="text-xs text-muted-foreground">Specify the controlled reason, method, date, and accountability status.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border bg-muted/30 p-4">
          <p className="mb-3 font-semibold">Financial Information</p>
          <Rows rows={[["Acquisition Cost", asset.acquisitionCost], ["Current Book Value", asset.bookValue], ["Depreciation Method", "Straight line"], ["Useful Life", "5 years"], ["Asset Condition", asset.condition]]} />
        </div>
        <div className="rounded-md border bg-muted/30 p-4">
          <p className="mb-3 font-semibold">Current Accountability</p>
          <Rows rows={[["Custodian", asset.custodian], ["Department", asset.department], ["Location", asset.location], ["Asset Status", asset.status]]} />
          <label className="mt-4 flex items-start gap-2 text-xs font-medium">
            <input checked={value.accountabilityCleared} onChange={(event) => update("accountabilityCleared", event.target.checked)} className="mt-0.5 size-4 accent-primary" type="checkbox" />
            Accountability clearance has been completed for this asset.
          </label>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Disposal Reason *">
          <Select value={value.reason} onValueChange={(next) => update("reason", next)}>
            <SelectTrigger><SelectValue placeholder="Select disposal reason" /></SelectTrigger>
            <SelectContent>{reasons.map((reason) => <SelectItem key={reason} value={reason}>{reason.replaceAll("_", " ")}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Recommended Disposal Method *">
          <Select value={value.method} onValueChange={(next) => update("method", next)}>
            <SelectTrigger><SelectValue placeholder="Select disposal method" /></SelectTrigger>
            <SelectContent>{methods.map((method) => <SelectItem key={method} value={method}>{method.replaceAll("_", " ")}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Request Date *"><Input type="date" value={value.requestDate} onChange={(event) => update("requestDate", event.target.value)} /></Field>
        {value.reason === "OTHER" && <Field label="Other Reason *"><Input value={value.otherReason} onChange={(event) => update("otherReason", event.target.value)} placeholder="Describe the disposal reason" /></Field>}
        {value.method === "OTHER" && <Field label="Other Method *"><Input value={value.otherMethod} onChange={(event) => update("otherMethod", event.target.value)} placeholder="Describe the disposal method" /></Field>}
      </div>
      <Field label="Remarks *"><Textarea value={value.remarks} onChange={(event) => update("remarks", event.target.value)} placeholder="Summarize the condition, inspection findings, and justification for disposal." /></Field>
      <div className="rounded-md border border-warning-border bg-warning p-3 text-xs text-warning-foreground">
        Disposal is final after authorization and execution. This request retains the asset record, financial data, and full audit history.
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-xs font-medium">{label}{children}</label>
}

function Rows({ rows }: { rows: string[][] }) {
  return <dl className="space-y-2 text-xs">{rows.map(([label, value]) => <div key={label} className="flex justify-between gap-3"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl>
}
