"use client"

import { CheckCircle2, FileCheck2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DisposalDocuments } from "./types"
import { documentLabels } from "./types"

export function DisposalDocumentsForm({
  value,
  onChange,
}: {
  value: DisposalDocuments
  onChange: (value: DisposalDocuments) => void
}) {
  const update = (key: keyof DisposalDocuments, next: boolean) => onChange({ ...value, [key]: next })
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">3. Documents & Approval</h2>
        <p className="text-xs text-muted-foreground">Attach supporting records and acknowledge the approval requirement.</p>
      </div>
      <div className="space-y-3">
        {documentLabels.map(([key, label, description]) => (
          <div key={key} className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <span className="grid size-9 place-items-center rounded bg-muted"><FileCheck2 className="size-5 text-primary" /></span>
              <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{description}</p></div>
            </div>
            <Button size="sm" variant={value[key] ? "secondary" : "outline"} onClick={() => update(key, !value[key])}>
              {value[key] ? <><CheckCircle2 /> Attached</> : <><Upload /> Attach</>}
            </Button>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-purple-border bg-purple p-4 text-sm text-purple-foreground">
        <p className="font-semibold">Approval requirement</p>
        <p className="mt-1 text-xs">Final disposal cannot be executed until the request receives committee evaluation and authorized approval.</p>
        <label className="mt-3 flex items-start gap-2 text-xs font-medium">
          <input checked={value.approvalAcknowledged} onChange={(event) => update("approvalAcknowledged", event.target.checked)} className="mt-0.5 size-4 accent-primary" type="checkbox" />
          I confirm that required documents are complete and this request will be submitted for approval.
        </label>
      </div>
    </section>
  )
}
