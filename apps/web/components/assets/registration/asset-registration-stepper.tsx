"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Basic information", "Identification", "Acquisition", "Location & assignment", "Review & confirm"];

export function AssetRegistrationStepper({ current }: { current: number }) {
  return <ol className="grid gap-3 sm:grid-cols-5">
    {steps.map((label, index) => <li key={label} className="flex items-center gap-2">
      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold", index < current ? "border-primary bg-primary text-primary-foreground" : index === current ? "border-primary text-primary" : "text-muted-foreground")}>
        {index < current ? <Check className="size-4" aria-hidden="true" /> : index + 1}
      </span>
      <span className={cn("text-xs font-medium leading-tight", index === current ? "text-foreground" : "text-muted-foreground")}>{label}</span>
    </li>)}
  </ol>;
}
