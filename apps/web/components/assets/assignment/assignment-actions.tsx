import { ArrowLeft, ArrowRight, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssignmentActions({ step, disabled, pending, onBack, onNext, onConfirm }: { step: number; disabled: boolean; pending: boolean; onBack: () => void; onNext: () => void; onConfirm: () => void }) {
  return <div className="mt-5 flex justify-between border-t pt-4"><Button variant="outline" onClick={onBack} disabled={step === 0 || pending}><ArrowLeft className="mr-2 size-4" />Back</Button>{step < 3 ? <Button onClick={onNext} disabled={disabled}>Continue<ArrowRight className="ml-2 size-4" /></Button> : <Button onClick={onConfirm} disabled={disabled || pending}><ClipboardCheck className="mr-2 size-4" />{pending ? "Assigning…" : "Confirm Assignment"}</Button>}</div>;
}
