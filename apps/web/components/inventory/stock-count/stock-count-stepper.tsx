"use client"

import { CheckCircle2, MapPin, ListChecks, ClipboardList, Scan, Diff, Search, CheckCircle, Settings2 } from "lucide-react"

const steps = [
  { label: "Create Count", icon: ClipboardList },
  { label: "Select Location", icon: MapPin },
  { label: "Generate List", icon: ListChecks },
  { label: "Physical Count", icon: Search },
  { label: "Enter/Scan Qty", icon: Scan },
  { label: "Compare", icon: Diff },
  { label: "Review Discrepancy", icon: Search },
  { label: "Approve Adjustment", icon: CheckCircle },
  { label: "Finalize", icon: Settings2 },
]

export function StockCountStepper() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-col items-center">
            <div className="flex size-8 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary">
              <step.icon className="size-4" />
            </div>
            <span className="mt-1 text-[10px] text-muted-foreground hidden sm:block">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
