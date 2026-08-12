import type { Assignee } from "./types";
import { assignees } from "./types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type AssignmentDetails = { assigneeId: string; department: string; office: string; location: string; assignmentDate: string; returnDate: string; purpose: string; remarks: string };
export function AssignmentDetailsForm({ value, onChange }: { value: AssignmentDetails; onChange: (value: AssignmentDetails) => void }) {
  const update = (key: keyof AssignmentDetails, next: string) => onChange({ ...value, [key]: next });
  const assignee = assignees.find((item) => item.id === value.assigneeId);
  return <section className="space-y-4"><div><h2 className="text-base font-semibold">2. Assignment Details</h2><p className="text-xs text-muted-foreground">Select the assignee, destination, and assignment date.</p></div><div className="grid gap-3 md:grid-cols-2">
    <Field label="Assignee *"><Select value={value.assigneeId} onValueChange={(next) => update("assigneeId", next)}><SelectTrigger><SelectValue placeholder="Select an active employee" /></SelectTrigger><SelectContent>{assignees.map((item) => <SelectItem key={item.id} value={item.id}>{item.name} · {item.employeeId}</SelectItem>)}</SelectContent></Select></Field>
    <Field label="Department *"><Select value={value.department} onValueChange={(next) => update("department", next)}><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent>{["ICT", "General Services", "Registrar"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></Field>
    <Field label="Office *"><Select value={value.office} onValueChange={(next) => update("office", next)}><SelectTrigger><SelectValue placeholder="Select office" /></SelectTrigger><SelectContent>{["ICT Operations", "Property Unit", "Registrar Office"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></Field>
    <Field label="Location *"><Select value={value.location} onValueChange={(next) => update("location", next)}><SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger><SelectContent>{["ICT Office - Room 203", "Administration Building - Room 101", "Main Campus - Stock Room"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></Field>
    <Field label="Assignment Date *"><Input type="date" value={value.assignmentDate} onChange={(event) => update("assignmentDate", event.target.value)} /></Field><Field label="Expected Return Date"><Input type="date" value={value.returnDate} onChange={(event) => update("returnDate", event.target.value)} /></Field>
    <Field label="Purpose"><Input value={value.purpose} placeholder="e.g. Faculty workstation" onChange={(event) => update("purpose", event.target.value)} /></Field><Field label="Remarks"><Textarea value={value.remarks} onChange={(event) => update("remarks", event.target.value)} /></Field>
  </div>{assignee && <AssigneeInformation assignee={assignee} />}</section>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1.5 text-xs font-medium">{label}{children}</label>; }
function AssigneeInformation({ assignee }: { assignee: Assignee }) { return <div className="rounded-md border bg-muted/30 p-4"><p className="mb-3 text-sm font-semibold">Assignee Information</p><div className="grid gap-3 text-xs sm:grid-cols-3">{[["Employee ID", assignee.employeeId], ["Position", assignee.position], ["Department", assignee.department], ["Office", assignee.office], ["Email", assignee.email]].map(([label, value]) => <p key={label}><span className="text-muted-foreground">{label}</span><br /><strong>{value}</strong></p>)}</div></div>; }
