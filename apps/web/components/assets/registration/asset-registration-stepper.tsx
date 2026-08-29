"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  ["Basic Information", "Asset details"],
  ["Identification", "Serial & tags"],
  ["Acquisition", "Purchase details"],
  ["Location & Assignment", "Where & to whom"],
  ["Review & Confirm", "Preview & save"],
];
export function AssetRegistrationStepper({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (step: number) => void;
}) {
  return (
    <ol className="grid gap-3 rounded-lg border border-t-4 border-primary bg-card p-4 md:grid-cols-5">
      {steps.map(([title, description], index) => (
        <li key={title} className="flex gap-2">
          <button
            type="button"
            disabled={index > current}
            onClick={() => onSelect(index)}
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold",
              index === current
                ? "border-primary bg-primary text-primary-foreground"
                : index < current
                  ? "border-primary bg-primary/15 text-primary"
                  : "text-muted-foreground",
            )}
          >
            {index < current ? <Check className="size-4" /> : index + 1}
          </button>
          <span>
            <span className="block text-sm font-semibold">{title}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

