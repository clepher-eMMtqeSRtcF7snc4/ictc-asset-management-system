import { ClipboardSignature } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssetAssignmentHeaderSection({ canReview, onReview, onCancel }: { canReview: boolean; onReview: () => void; onCancel: () => void }) {
  return <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-xs text-muted-foreground">Dashboard <span className="mx-2">›</span> Asset Management <span className="mx-2">›</span> Asset Assignment</p>
      <h1 className="mt-3 flex items-center gap-2 text-2xl font-bold"><ClipboardSignature className="size-6 text-primary" />Asset Assignment</h1>
      <p className="mt-1 text-sm text-muted-foreground">Assign an available ICT asset to an employee, department, or location.</p>
    </div>
    <div className="flex gap-2"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button disabled={!canReview} onClick={onReview}>Review & Assign</Button></div>
  </header>;
}
