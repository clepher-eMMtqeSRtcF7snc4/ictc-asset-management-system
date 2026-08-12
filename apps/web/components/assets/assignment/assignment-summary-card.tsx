import type { AssignableAsset } from "./types";
import type { AssignmentDetails } from "./assignment-details-form";
import { Card, CardContent } from "@/components/ui/card";

export function AssignmentSummaryCard({ asset, details }: { asset?: AssignableAsset; details: AssignmentDetails }) {
  const rows = [["Assignee", details.assigneeId ? details.assigneeId === "u1" ? "Juan Dela Cruz" : "Maria Santos" : "—"], ["Department", details.department || "—"], ["Location", details.location || "—"], ["Assignment date", details.assignmentDate || "—"]];
  return <Card><CardContent className="p-4"><p className="mb-3 text-xs font-semibold">Assignment Summary</p>{asset ? <dl className="space-y-2 text-xs">{rows.map(([label, value]) => <div key={label} className="flex justify-between gap-3"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl> : <p className="text-sm text-muted-foreground">Select an asset to begin an assignment.</p>}</CardContent></Card>;
}
